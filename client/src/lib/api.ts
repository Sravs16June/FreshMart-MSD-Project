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

export type AuthResponse = { token: string; user: { id: string; name: string; email: string } };

export async function authRegister(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handle<AuthResponse>(res);
}

export async function authLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handle<AuthResponse>(res);
}

export async function generateRecipe(ingredients: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/ai/generate-recipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ ingredients }),
  });
  return handle<{ recipe: string }>(res);
}
