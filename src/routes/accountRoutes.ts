import { Router } from 'express';
import {handleKYCData} from "../controllers/accountController";


const router = Router();


router.post("/submitKYC", handleKYCData);


export default router;
