import { createContext, ReactNode, useContext } from "react";
import { ApiClient, useApiClient as useApiClientRaw } from "../lib/api/api";

export interface ClientContext {
  client: ApiClient | null;
}

const ClientContext = createContext<ClientContext>({ client: null });

export function ClientProvider({ children }: { children?: ReactNode }) {
  const client = useApiClientRaw();

  return (
    <ClientContext.Provider value={{ client }}>
      { children }
    </ClientContext.Provider>
  );
}

export const useApiClient = () => useContext(ClientContext).client;
