import { Request, Response } from 'express';
import mongoose from 'mongoose'
import User from '../entity/UserModel';
import Business from '../entity/Business';
import KycDocument from '../entity/KycDocument';
import multer from "multer";



const storage = multer.diskStorage({ destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => { cb(null, 'uploads/'); }, 
filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => { cb(null, `${Date.now()}-${file.originalname}`); 
} }); 
const upload = multer({ storage }); 
const handleFileUploads = upload.fields([ { name: 'files', maxCount: 10 }, 
  { name: 'utilityBills', maxCount: 1 }, 
  { name: 'certificateOfIncorporation', maxCount: 1 }, 
  { name: 'memat', maxCount: 1 }, 
  { name: 'operationLicense', maxCount: 1 } ]);

export const handleKYCData = [ handleFileUploads, async (req: Request, res: Response) => { 
  const { name, address, phoneNumber, dateOfBusinessIncorporation, userId } = req.body; 
  const files = req.files as { [fieldname: string]: Express.Multer.File[]; };


const documents = []; 
if (files.files) { 
  documents.push(...files.files.map(file => ({ 
    fileType: 'general', 
    filePath: file.filename }))); } 
    if (files.utilityBills) {
       documents.push({ fileType: 'utilityBills', filePath: files.utilityBills[0].filename }); 
      } if (files.certificateOfIncorporation) { 
        documents.push({ fileType: 'certificateOfIncorporation', filePath: files.certificateOfIncorporation[0].filename }); 
      } if (files.memat) {
         documents.push({ fileType: 'memat', filePath: files.memat[0].filename }); 
        } if (files.operationLicense) { 
          documents.push({ fileType: 'operationLicense', filePath: files.operationLicense[0].filename });
         }


      console.log('Documents:', documents); 
      console.log('Other Details:', { name, address, phoneNumber, dateOfBusinessIncorporation });


    try { const newKycDocument = new KycDocument({ userId: new mongoose.Types.ObjectId(userId),
    documents });

    await newKycDocument.save(); console.log('Data saved to MongoDB:', newKycDocument); res.status(200).json({ message: 'KYC data received and saved' }); } catch (error) { console.error('Error saving data to MongoDB:', error); res.status(500).json({ message: 'Error saving data' }); } } ];








interface DirectorDetails {
  // Add your director details properties here
  name?: string;
  position?: string;
  // ... other properties
}

interface DirectorUpdateBody {
  businessId: string;
  directorDetails: DirectorDetails;
}

export const updateDirectorDetails = async (req: Request<{}, {}, DirectorUpdateBody>, res: Response): Promise<void> => {
  try {
    const { businessId, directorDetails } = req.body;

    const business = await Business.findByIdAndUpdate(
      businessId, 
      { directorDetails }, 
      { new: true }
    );

    if (!business) {
      res.status(404).json({ message: 'Business not found' });
      return;
    }

    res.status(200).json({ 
      message: 'Director details updated successfully', 
      business 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating director details', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

interface AdminDetails {
  // Add your admin details properties here
  name?: string;
  role?: string;
  // ... other properties
}

interface AdminUpdateBody {
  adminId: string;
  adminDetails: AdminDetails;
}

export const updateAdminDetails = async (req: Request<{}, {}, AdminUpdateBody>, res: Response): Promise<void> => {
  try {
    const { adminId, adminDetails } = req.body;

    const admin = await User.findByIdAndUpdate(
      adminId, 
      { adminDetails }, 
      { new: true }
    );

    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }

    res.status(200).json({ 
      message: 'Admin details updated successfully', 
      admin 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating admin details', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};