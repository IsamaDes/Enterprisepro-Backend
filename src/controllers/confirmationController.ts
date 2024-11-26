// controllers/confirmationController.js
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../entity/User';

export const confirmEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    const userId = decoded.id;

    await User.findByIdAndUpdate(userId, { isVerified: true });
 res.redirect('/login'); // Redirect to the login page after confirmation
  } catch (err) {
    return res.status(400).send('Invalid token');
  }
};
