/**
 * Core HTTP service wrapper for API requests.
 * Uses relative URLs so Next.js rewrites proxy to backend in development and production.
 */

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

class HttpService {
  private baseHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  async request<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.baseHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage =
          data.detail || data.error || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error: any) {
      console.error(`[HTTP Error] ${options.method || "GET"} ${url}:`, error.message);
      throw error;
    }
  }

  get<T = any>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  post<T = any>(url: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  put<T = any>(url: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = any>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }
}

export const http = new HttpService();
