import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all rooms
export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new room
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, capacity, type, description } = req.body;
    const room = await prisma.room.create({
      data: {
        name,
        capacity,
        type,
        description
      }
    });
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a room
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, capacity, type, description } = req.body;
    const room = await prisma.room.update({
      where: { id },
      data: {
        name,
        capacity,
        type,
        description
      }
    });
    res.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a room
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.room.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 