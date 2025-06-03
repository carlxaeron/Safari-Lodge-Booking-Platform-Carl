import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Hardcoded credentials for test purposes
const TEST_CREDENTIALS = {
  email: 'lodge@test.com',
  password: 'password123',
  name: 'Test Lodge',
  role: 'lodge'
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // For test purposes, we'll use hardcoded credentials
    if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
      const token = jwt.sign(
        { 
          id: '1', 
          email: TEST_CREDENTIALS.email,
          role: TEST_CREDENTIALS.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: '1',
          email: TEST_CREDENTIALS.email,
          name: TEST_CREDENTIALS.name,
          role: TEST_CREDENTIALS.role
        }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 