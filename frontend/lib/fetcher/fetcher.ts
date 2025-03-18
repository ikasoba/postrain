import { useMemo } from "react";

let atomics: Promise<void> = Promise.resolve();

export function useFetcher() {
  return useMemo(() => {
    return (...args: Parameters<typeof fetch>): Promise<Response> => new Promise((resolve, reject) => {
      atomics = atomics.then(() => fetch(...args).then(resolve, reject));
    })
  }, []);
}
