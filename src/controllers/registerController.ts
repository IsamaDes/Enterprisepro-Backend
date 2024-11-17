import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
// import errorHandler from '../middleware/erroHandler'; 

// Registration
 export const register = async (req: Request, res: Response) => {
  const { businessName, contactPerson, email, phone, location, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      businessName,
      contactPerson,
      email,
      phone,
      location,
      password: hashedPassword,
      role: 'admin'
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

