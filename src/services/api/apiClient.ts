/**
 * Base API Client for ScaleUp Gulf AI
 * 
 * Provides unified HTTP client abstraction ready for connection to:
 * - Express/Node backend (/api/*)
 * - Supabase / PostgreSQL with JWT & RLS
 * - n8n Webhook Triggers
 * 
 * Supports transparent fallback to simulated latency & verified demo state
 * when live backend is offline, clearly marking integration boundaries.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  source: 'live_backend' | 'verified_cache' | 'mock_simulation';
  timestamp: string;
}

export class ApiError extends Error {
  statusCode: number;
  endpoint: string;

  constructor(message: string, statusCode: number, endpoint: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;
  private businessId: string | null = null;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public setBusinessId(bizId: string | null) {
    this.businessId = bizId;
  }

  public getBusinessId(): string | null {
    return this.businessId;
  }

  /**
   * Generic request handler with authorization headers & tenant boundary
   */
  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    fallbackData?: T
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (this.businessId) {
      headers['X-Business-Id'] = this.businessId;
    }

    try {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
      const res = await fetch(url, {
        ...options,
        headers,
      });

      if (res.ok) {
        const json = await res.json();
        return {
          data: json.data || json,
          status: res.status,
          source: 'live_backend',
          timestamp: new Date().toISOString(),
        };
      }

      // If backend returns a structured 401/403/404/500, check if we should throw or fallback
      if (res.status === 401 || res.status === 403) {
        throw new ApiError('Unauthorized or insufficient permissions', res.status, endpoint);
      }

      if (fallbackData !== undefined) {
        return {
          data: fallbackData,
          status: res.status,
          source: 'mock_simulation',
          timestamp: new Date().toISOString(),
        };
      }

      throw new ApiError(`Request failed with status ${res.status}`, res.status, endpoint);
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }

      // If network unreachable (e.g. backend endpoint not yet deployed), gracefully return fallback
      if (fallbackData !== undefined) {
        return {
          data: fallbackData,
          status: 200,
          source: 'mock_simulation',
          timestamp: new Date().toISOString(),
        };
      }

      throw new ApiError(err?.message || 'Network request failed', 500, endpoint);
    }
  }

  public async get<T>(endpoint: string, fallbackData?: T): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, fallbackData);
  }

  public async post<T>(endpoint: string, body?: any, fallbackData?: T): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      fallbackData
    );
  }

  public async put<T>(endpoint: string, body?: any, fallbackData?: T): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      },
      fallbackData
    );
  }

  public async patch<T>(endpoint: string, body?: any, fallbackData?: T): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
      },
      fallbackData
    );
  }

  public async delete<T>(endpoint: string, fallbackData?: T): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, fallbackData);
  }
}

export const apiClient = new ApiClient();
