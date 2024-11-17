import { Router } from 'express';
import { register, login,  } from '../controllers/autheController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
// router.post('/reset-password/:token', resetPassword);

export default router;
