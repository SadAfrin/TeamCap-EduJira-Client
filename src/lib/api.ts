const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export async function apiGet(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  return res.json();
}

export async function apiPost(path: string, body: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}