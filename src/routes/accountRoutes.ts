import { Router } from 'express';
import {handleKYCData} from "../controllers/accountController";
import { updateDirectorDetails, updateAdminDetails } from '../controllers/accountController';


const router = Router();


router.post("/submitKYC", handleKYCData);
// Route to update director details for a business
router.patch('/director/update', updateDirectorDetails);

// Route to update admin details for a user
router.patch('/admin/update', updateAdminDetails);

export default router;
