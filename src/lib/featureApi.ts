/**
 * Same-origin fetch helpers for leave/messages/upload.
 * Next.js rewrites proxy these to Express and forward Better Auth cookies.
 */
export async function featureFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
  return res;
}
