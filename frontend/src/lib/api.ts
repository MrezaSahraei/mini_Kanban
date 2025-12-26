// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

export interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
}

export interface Task {
  id: number;
  creator: number;
  creator_name: string;
  title: string;
  description: string;
  progress: number;
  assigned_to: string[];
  status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user_id?: number;
  username?: string;
}

export interface SignupData {
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  assigned_to?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  progress?: number;
  status?: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
  assigned_to?: string[];
}

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Token ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || 'خطا در ارتباط با سرور');
  }

  return response.json();
};

// Auth APIs
export const signup = async (data: SignupData): Promise<{ message: string; username: string }> => {
  return apiRequest('/tasks/signup/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  return apiRequest('/tasks/login/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const logout = (): void => {
  removeToken();
};

// User APIs
export const getUsers = async (): Promise<User[]> => {
  return apiRequest('/tasks/users-list/');
};

// Task APIs
export const createTask = async (data: CreateTaskData): Promise<{ message: string }> => {
  return apiRequest('/tasks/create/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getMyTasks = async (): Promise<Task[]> => {
  return apiRequest('/tasks/created-by-me/');
};

export const getAssignedTasks = async (): Promise<Task[]> => {
  return apiRequest('/tasks/assigned-to-me/');
};

export const getAllTasks = async (): Promise<Task[]> => {
  return apiRequest('/tasks/list/');
};

export const getTaskDetail = async (id: number): Promise<Task> => {
  return apiRequest(`/tasks/detail/${id}`);
};

export const updateTask = async (id: number, data: UpdateTaskData): Promise<Task> => {
  return apiRequest(`/tasks/detail/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteTask = async (id: number): Promise<void> => {
  return apiRequest(`/tasks/detail/${id}`, {
    method: 'DELETE',
  });
};
