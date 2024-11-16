import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/register', register);
// router.post('/reset-password/:token', resetPassword);
router.post('/login', login);




export default router;
