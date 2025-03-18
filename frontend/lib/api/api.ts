import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface ApiClient {
  csrfToken: string;
  ws(u: URL): Promise<WebSocket>;
  fetch(u: URL, req: RequestInit): Promise<Response>;
}

export function createApiClient(token: string, csrfToken: string, onCsrfTokenUpdated: (csrfToken: string) => (void | Promise<void>)): ApiClient {
  let atomic: Promise<void> = Promise.resolve();

  return {
    get csrfToken() {
      return csrfToken;
    },
    ws: (u: URL) => new Promise((resolve, reject) => {
      atomic = atomic.then(() => {
        try {
          resolve(new WebSocket(u));
        } catch (err) {
          reject(err);
        }
      })
    }),
    fetch: (u: URL, req: RequestInit) => new Promise((resolve, reject) => {
      atomic = atomic.then(() => {
        const headers = new Headers(req.headers);

        headers.set("Authorization", `Bearer ${token}`);
        headers.set("X-XSRF-TOKEN", csrfToken);

        req.headers = headers;

        return fetch(u, req).then(async (res) => {
          if (res.headers.has("X-XSRF-TOKEN")) {
            console.log(res.headers.get("X-XSRF-TOKEN"), res.headers)
            csrfToken = res.headers.get("X-XSRF-TOKEN") ?? csrfToken;
            await onCsrfTokenUpdated(csrfToken);
          }

          resolve(res);
        }, reject)
      });
    })
  }
}

export function useApiClient() {
  const router = useRouter();
  const [client, setClient] = useState<ApiClient | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const csrfToken = localStorage.getItem("csrfToken");

    if (!token || !csrfToken) {
      router.push("/login");
      return;
    }

    const onCsrfTokenUpdated = (csrfToken: string) => {
      console.log(csrfToken);
      localStorage.setItem("csrfToken", csrfToken);
    }

    setClient(createApiClient(token, csrfToken, onCsrfTokenUpdated))
  }, [router]);

  return client;
}
