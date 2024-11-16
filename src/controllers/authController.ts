import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
// import errorHandler from '../middleware/erroHandler'; 

interface DecodedToken {
    userId: string;
    role: string;
    iat: number;
    exp: number;
  }
  



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

// Login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => { 
    const { email, password } = req.body; 
    try { 
        const user = await User.findOne({ email }).exec(); 
        if (!user) { 
            return res.status(400).json({ message: 'Invalid credentials' }); 
        } const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) { return res.status(400).json({ message: 'Invalid credentials' }); 
    } const token = jwt.sign( { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET as string, { expiresIn: '1h' } ); 
        return res.status(200).json({ message: 'Login successful', token }); 
    } catch (error) { console.error('Error during login:', error); 
        return res.status(500).json({ message: 'Error logging in', error }); } };




// Reset Password
// export const resetPassword = async (req: Request, res: Response): Promise<Response | void> => {
//      const { token } = req.params; 
//      const { newPassword } = req.body; 
//      try { 
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken; 
//         const user = await User.findById(decoded.userId); 
//         if (!user) { return res.status(404).json({ message: 'User not found' }); } 
//         const hashedPassword = await bcrypt.hash(newPassword, 10); 
//         user.password = hashedPassword; 
//         await user.save(); 
//         return res.status(200).json({ message: 'Password reset successfully' }); 
//     } catch (error) { return res.status(400).json({ message: 'Invalid or expired token', error }); } };

