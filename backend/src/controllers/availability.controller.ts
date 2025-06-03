import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all availabilities
export const getAvailabilities = async (req: Request, res: Response) => {
  try {
    const availabilities = await prisma.availability.findMany({
      include: {
        room: true,
      },
    });
    res.json(availabilities);
  } catch (error) {
    console.error('Error fetching availabilities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new availability
export const createAvailability = async (req: Request, res: Response) => {
  try {
    const { roomId, startDate, endDate, status } = req.body;
    const availability = await prisma.availability.create({
      data: {
        roomId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || 'available',
      },
      include: {
        room: true,
      },
    });
    res.status(201).json(availability);
  } catch (error) {
    console.error('Error creating availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an availability
export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, status } = req.body;
    const availability = await prisma.availability.update({
      where: { id },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
      },
      include: {
        room: true,
      },
    });
    res.json(availability);
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an availability
export const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.availability.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 