import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  capacity: z.number().int().positive('Capacity must be a positive number'),
  type: z.string().min(1, 'Room type is required'),
  description: z.string().optional(),
});

export const availabilitySchema = z.object({
  roomId: z.number().int().positive('Room ID is required'),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  status: z.enum(['available', 'booked', 'maintenance']).default('available'),
}).refine((data) => data.startDate < data.endDate, {
  message: 'End date must be after start date',
}); 