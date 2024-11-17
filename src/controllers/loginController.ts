
import User from '../models/userModel';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';




// Login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
      });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  };