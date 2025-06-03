export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  type: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: number;
  roomId: number;
  startDate: string;
  endDate: string;
  status: 'available' | 'booked' | 'maintenance';
  room: Room;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationError {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
}

export interface ApiError {
  status: 'error';
  message: string;
  errors?: ValidationError[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
} 