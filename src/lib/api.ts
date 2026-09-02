const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiGet(path: string) {
  try {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error(`API GET error for ${path}:`, error);
    throw error;
  }
}

export async function apiPost(path: string, body: unknown) {
  try {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error(`API POST error for ${path}:`, error);
    throw error;
  }
}

export async function apiPut(path: string, body: unknown) {
  try {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error(`API PUT error for ${path}:`, error);
    throw error;
  }
}

export async function apiDelete(path: string) {
  try {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error(`API DELETE error for ${path}:`, error);
    throw error;
  }
}