export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface RegisterUser {
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface UserResponse {
  user: User;
  token: string;
}