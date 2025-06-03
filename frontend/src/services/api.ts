import axios, { AxiosError } from 'axios';
import type { User, Room, Availability, ApiResponse, ApiError } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.response?.data as ApiError };
      }
      return { error: { status: 'error', message: 'An unexpected error occurred' } };
    }
  },
};

// Rooms API
export const roomsApi = {
  getRooms: async (): Promise<ApiResponse<Room[]>> => {
    try {
      const response = await api.get('/rooms');
      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.response?.data as ApiError };
      }
      return { error: { status: 'error', message: 'An unexpected error occurred' } };
    }
  },

  createRoom: async (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Room>> => {
    try {
      const response = await api.post('/rooms', room);
      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.response?.data as ApiError };
      }
      return { error: { status: 'error', message: 'An unexpected error occurred' } };
    }
  },

  updateRoom: async (id: number, room: Partial<Room>): Promise<ApiResponse<Room>> => {
    try {
      const response = await api.put(`/rooms/${id}`, room);
      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.response?.data as ApiError };
      }
      return { error: { status: 'error', message: 'An unexpected error occurred' } };
    }
  },

  deleteRoom: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/rooms/${id}`);
      return { data: undefined };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.response?.data as ApiError };
      }
      return { error: { status: 'error', message: 'An unexpected error occurred' } };
    }
  },
};

// Availability API
export const availabilityApi = {
  getAvailabilities: async (): Promise<ApiResponse<Availability[]>> => {
    try {
      const response = await api.get('/availability');
      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.response?.data as ApiError };
      }
      return { error: { status: 'error', message: 'An unexpected error occurred' } };
    }
  },

  createAvailability: async (
    availability: Omit<Availability, 'id' | 'createdAt' | 'updatedAt' | 'room'>
  ): Promise<ApiResponse<Availability>> => {
    try {
      const response = await api.post('/availability', availability);
      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.response?.data as ApiError };
      }
      return { error: { status: 'error', message: 'An unexpected error occurred' } };
    }
  },

  updateAvailability: async (
    id: number,
    availability: Partial<Availability>
  ): Promise<ApiResponse<Availability>> => {
    try {
      const response = await api.put(`/availability/${id}`, availability);
      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.response?.data as ApiError };
      }
      return { error: { status: 'error', message: 'An unexpected error occurred' } };
    }
  },

  deleteAvailability: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/availability/${id}`);
      return { data: undefined };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.response?.data as ApiError };
      }
      return { error: { status: 'error', message: 'An unexpected error occurred' } };
    }
  },
}; 