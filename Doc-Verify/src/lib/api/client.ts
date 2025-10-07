// Types for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    userType: 'university' | 'student' | 'company' | 'government';
    institution?: string;
  };
  token: string;
}

export interface VerificationResponse {
  verificationId: string;
  message: string;
}

export interface VerificationResult {
  status: 'completed' | 'failed';
  steps: {
    step: string;
    status: 'completed' | 'failed';
    result: boolean;
    details?: string;
  }[];
}

export interface DashboardStats {
  totalDocuments: number;
  pendingVerifications: number;
  completedVerifications: number;
  failedVerifications: number;
}

// API client configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || 'An error occurred' };
  }
  const data = await response.json();
  return { data };
}

// API client class
export class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(response);
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    userType: string;
    institution?: string;
    registrationNumber?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse<AuthResponse>(response);
  }

  // Document endpoints
  async uploadDocument(formData: FormData): Promise<ApiResponse<{ document: any }>> {
    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });
    return handleResponse<{ document: any }>(response);
  }

  async verifyDocument(documentId: string): Promise<ApiResponse<VerificationResponse>> {
    const response = await fetch(`${API_URL}/documents/verify/${documentId}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return handleResponse<VerificationResponse>(response);
  }

  async getVerificationStatus(verificationId: string): Promise<ApiResponse<VerificationResult>> {
    const response = await fetch(`${API_URL}/documents/verification/${verificationId}`, {
      headers: this.getHeaders(),
    });
    return handleResponse<VerificationResult>(response);
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: this.getHeaders(),
    });
    return handleResponse<DashboardStats>(response);
  }

  async getVerificationHistory(page: number = 1, limit: number = 10): Promise<ApiResponse<any>> {
    const response = await fetch(
      `${API_URL}/dashboard/history?page=${page}&limit=${limit}`,
      { headers: this.getHeaders() }
    );
    return handleResponse<any>(response);
  }

  async getPendingDocuments(page: number = 1, limit: number = 10): Promise<ApiResponse<any>> {
    const response = await fetch(
      `${API_URL}/dashboard/pending?page=${page}&limit=${limit}`,
      { headers: this.getHeaders() }
    );
    return handleResponse<any>(response);
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();