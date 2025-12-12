import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.31.44:8081';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        if (typeof window === 'undefined') {
          return Promise.reject(error);
        }

        const status = error.response?.status;
        const message = (error.response?.data as any)?.message || error.message;

        if (status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        if (status === 403) {
          alert('Access denied');
          return Promise.reject(error);
        }

        if (status === 404) {
          alert('Resource not found');
          return Promise.reject(error);
        }

        if (status && status >= 500) {
          alert('Server error, please try again');
          return Promise.reject(error);
        }

        if (error.code === 'NETWORK_ERROR') {
          alert('Network error, please check connection');
          return Promise.reject(error);
        }

        if (message) {
          alert(`An error occurred: ${message}`);
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
