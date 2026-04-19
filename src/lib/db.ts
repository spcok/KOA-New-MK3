import { QueryClient } from "@tanstack/react-query";
import { pglite } from "./pglite";

// Create a configured QueryClient instance
export const queryClient = new QueryClient();

// Wrap PGlite database queries using TanStack Query standards
export const db = {
  client: pglite,
  queryClient,
  // Helper to run queries inside TanStack Query
  async query(queryText: string, params?: any[]) {
    return pglite.query(queryText, params);
  },
  async exec(queryText: string) {
    return pglite.exec(queryText);
  }
};
