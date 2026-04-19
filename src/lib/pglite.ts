import { PGlite } from "@electric-sql/pglite";

// Use IndexedDB persistence for offline-first capabilities
export const pglite = new PGlite("idb://koa_manager_v3");

export const initDb = async () => {
  // Fetch schema as text if we were loading from a file, but since we are in browser, 
  // we will import it using Vite raw import or define strings here.
  // We can use a raw import for schema.sql
  const { default: schema } = await import("./schema.sql?raw");
  
  await pglite.exec(schema);
};

// Auto-initialize when this script runs
initDb().catch(console.error);
