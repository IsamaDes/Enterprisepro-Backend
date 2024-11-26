
import {Router} from 'express';
import { registerUser  } from '../controllers/authController';
import { login  } from '../controllers/authController';
import { resetPassword  } from '../controllers/authController';




const router = Router();
router.post('/register', registerUser);
router.post('/login', login);
router.patch('/reset-password/:token', resetPassword);


export default router;