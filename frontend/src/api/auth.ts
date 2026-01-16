import axios from 'axios';
import { API_BASE_URL } from './client';
import { LoginResponse, RegisterRequest } from '../types/api';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
};

export const register = async (email: string, password: string): Promise<void> => {
    const requestBody: RegisterRequest = { email, password };
    await axios.post(`${API_BASE_URL}/auth/register`, requestBody);
};