// routes/confirmation.js
import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../entity/User';

const router = express.Router();

router.get('/confirmation/:token', async (req: Request, res: Response) => { 
    try { 
    const { token } = req.params; 
    const secret = process.env.JWT_SECRET

    if (!secret) { 
        throw new Error('JWT_SECRET is not defined'); 
    }
    const decoded = jwt.verify(token, secret) as JwtPayload; 
    const userId = decoded.id;

    if (!userId) { return res.status(400).send('Invalid token'); }
    
    await User.findByIdAndUpdate(userId, { isVerified: true }); 
    return res.redirect('/login'); 
} catch (err) { 
    return res.status(400).send('Invalid token'); 
}
 });


 export default router;