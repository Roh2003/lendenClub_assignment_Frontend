// API Client - Fetch-based with proper error propagation
interface ApiConfig {
  method: string
  url: string
  data?: any
  headers?: Record<string, string>
}

interface ApiResponse<T = any> {
  data: T
  status: number
}

interface ApiError {
  message: string
  status: number
  data?: any
}

class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL

  private async request<T>(config: ApiConfig): Promise<ApiResponse<T>> {
    const { method, url, data, headers = {} } = config

    const token = localStorage.getItem("token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    const responseData = await response.json().catch(() => null)

    if (!response.ok) {
      // 🔥 THROW STRUCTURED ERROR
      const apiError: ApiError = {
        message: responseData?.message || "Request failed",
        status: response.status,
        data: responseData,
      }

      throw apiError
    }

    return {
      data: responseData,
      status: response.status,
    }
  }

  get<T = any>(url: string, config?: Partial<ApiConfig>) {
    return this.request<T>({ method: "GET", url, ...config })
  }

  post<T = any>(url: string, data?: any, config?: Partial<ApiConfig>) {
    return this.request<T>({ method: "POST", url, data, ...config })
  }

  put<T = any>(url: string, data?: any, config?: Partial<ApiConfig>) {
    return this.request<T>({ method: "PUT", url, data, ...config })
  }

  delete<T = any>(url: string, config?: Partial<ApiConfig>) {
    return this.request<T>({ method: "DELETE", url, ...config })
  }
}

export const api = new ApiClient()
