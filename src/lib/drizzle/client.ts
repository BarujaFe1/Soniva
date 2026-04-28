import { drizzle } from "drizzle-orm/sqlite-proxy";
import { invoke } from "@tauri-apps/api/core";
import * as schema from "./schema";

type SqlMethod = "run" | "all" | "get" | "values";

type SqlResponse = {
  rows: unknown[] | unknown[][];
};

export const db = drizzle(
  async (sql: string, params: unknown[], method: SqlMethod) => {
    const response = await invoke<SqlResponse>("execute_sql", {
      payload: { sql, params, method }
    });
    return response;
  },
  { schema }
);
