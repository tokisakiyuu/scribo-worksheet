import { createClient } from "@vercel/kv";

const KEY_PREFIX = "SCRIBO_WORKSHEET:";

export const client = createClient({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
});

async function get<TData>(key: string): Promise<TData | null> {
  return client.get<TData>(`${KEY_PREFIX}${key}`);
}

async function set<TData>(
  key: string,
  value: TData,
): Promise<"OK" | TData | null> {
  return client.set<TData>(`${KEY_PREFIX}${key}`, value);
}

const db = { get, set };

export default db;
