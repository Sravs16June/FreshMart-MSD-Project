const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_BASE}/api/products`, { credentials: "include" });
  return handle<any[]>(res);
}

export async function health() {
  const res = await fetch(`${API_BASE}/health`, { credentials: "include" });
  return handle<{ ok: boolean; service: string }>(res);
}
