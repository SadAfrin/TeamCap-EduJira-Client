const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

// Helper function to safely combine URLs and prevent double slashes
function buildUrl(path: string) {
  return path.startsWith("http")
    ? path
    : `${BASE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export async function apiGet(path: string) {
  try {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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

export async function apiPost(path: string, body: unknown) {
  try {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

export async function apiPut(path: string, body: unknown) {
  try {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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

export async function apiPatch(path: string, body: unknown) {
  try {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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

export async function apiDelete(path: string) {
  try {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
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