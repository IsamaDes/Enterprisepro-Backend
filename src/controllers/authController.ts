import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export const register = async (req: Request, res: Response) => {
  const { businessName, contactPerson, email, phone, location, password } = req.body;
  const userRepository = getRepository(User);

  // Log incoming request data for debugging
  console.log('Incoming request data:', req.body);

  try {
    // Check if all required fields are defined
    if (!businessName || !contactPerson || !email || !phone || !location || !password) {
      throw new Error('Missing required fields');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Log data before creating user
    console.log('Creating user with data:', { businessName, contactPerson, email, phone, location, hashedPassword });

    const user = userRepository.create({
      businessName,
      contactPerson,
      email,
      phone,
      location,
      password: hashedPassword,
    });

    // Log user object before saving
    console.log('User object before saving:', user);

    await userRepository.save(user);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in registration:", error.message);
      res.status(500).json({ message: 'Error registering user', error: error.message });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
