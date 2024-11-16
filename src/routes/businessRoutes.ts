import {Router} from 'express';
import { createBusiness, getBusiness,updateBusiness, deleteBusiness } from '../controllers/businessController';

const router = Router();

router.post('/create', createBusiness);
router.get('/:id', getBusiness);
router.patch('/:id', updateBusiness);
router.delete('/:id', deleteBusiness);

export default router;
