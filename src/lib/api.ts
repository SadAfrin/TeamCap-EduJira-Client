const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

// Helper function to safely combine URLs and prevent double slashes
function buildUrl(path: string) {
  return path.startsWith("http")
    ? path
    : `${BASE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function getClientSessionToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)(?:__Secure-)?better-auth\.session_token=([^;]+)/
  );
  if (!match || !match[1]) return null;
  const raw = decodeURIComponent(match[1]);
  return raw.split(".")[0];
}

function getRequestHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getClientSessionToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
}

export async function apiGet(path: string, customHeaders: Record<string, string> = {}) {
  try {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "GET",
      headers: getRequestHeaders(customHeaders),
      credentials: "include",
      cache: "no-store",
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, message: errorData.message || `HTTP error ${res.status}`, errorField: errorData.errorField || null, data: null };
    }
    
    return await res.json();
  } catch (error: any) {
    console.error(`API GET error for ${path}:`, error.message || error);
    return { success: false, message: error.message || "Network error", data: null };
  }
}

export async function apiPost(path: string, body: unknown, customHeaders: Record<string, string> = {}) {
  try {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "POST",
      headers: getRequestHeaders(customHeaders),
      credentials: "include",
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, message: errorData.message || `HTTP error ${res.status}`, errorField: errorData.errorField || null, data: null };
    }
    
    return await res.json();
  } catch (error: any) {
    console.error(`API POST error for ${path}:`, error.message || error);
    return { success: false, message: error.message || "Network error", data: null };
  }
}

export async function apiPut(path: string, body: unknown, customHeaders: Record<string, string> = {}) {
  try {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "PUT",
      headers: getRequestHeaders(customHeaders),
      credentials: "include",
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, message: errorData.message || `HTTP error ${res.status}`, errorField: errorData.errorField || null, data: null };
    }
    
    return await res.json();
  } catch (error: any) {
    console.error(`API PUT error for ${path}:`, error.message || error);
    return { success: false, message: error.message || "Network error", data: null };
  }
}

export async function apiPatch(path: string, body: unknown, customHeaders: Record<string, string> = {}) {
  try {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: getRequestHeaders(customHeaders),
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error(`API PATCH error for ${path}:`, error);
    throw error;
  }
}

export async function apiDelete(path: string, customHeaders: Record<string, string> = {}) {
  try {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "DELETE",
      headers: getRequestHeaders(customHeaders),
      credentials: "include",
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, message: errorData.message || `HTTP error ${res.status}`, errorField: errorData.errorField || null, data: null };
    }
    
    return await res.json();
  } catch (error: any) {
    console.error(`API DELETE error for ${path}:`, error.message || error);
    return { success: false, message: error.message || "Network error", data: null };
  }
}