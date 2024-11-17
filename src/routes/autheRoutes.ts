
import express, { Request, Response } from 'express';
import {  IUser } from '../models/userModel'; // Assuming you have a User model
import { register  } from '../controllers/autheController';
import User from '../models/userModel';



const router = express.Router();
router.post('/register', register);


router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Successful login, you can generate a token or session here
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;