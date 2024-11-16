import { Router } from 'express';
import { register, resetPassword } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/reset-password/:token', resetPassword);



export default router;
