// routes/confirmation.ts 
import express, { Request, Response } from 'express'; 
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import User from '../entity/User'; 
const router = express.Router();



router.get('/api/confirmation/:token', async (req: Request, res: Response) => { 
    try { 
        console.log('Confirmation route hit');
    const { token } = req.params; 
    const secret = process.env.JWT_SECRET
  
    if (!secret) { 
        throw new Error('JWT_SECRET is not defined'); 
    }
    const decoded = jwt.verify(token, secret) as JwtPayload; 
    const userId = decoded.id;
  
    if (!userId) { 
        console.error('Invalid token');
        return res.status(400).send('Invalid token'); }
  
    await User.findByIdAndUpdate(userId, { isVerified: true }); 
    console.log('User verified:', userId);
    return res.redirect('https://enterprisepro-frontend.onrender.com/login'); 
  } catch (err) { 
    console.error('Error during confirmation:', err);
    return res.status(400).send('Invalid token'); 
  }
  });