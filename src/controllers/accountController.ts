import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { KycDocument } from '../entity/KycDocument';
import multer from 'multer';

const storage = multer.diskStorage({ 
  destination: (req, file, cb) => { cb(null, 'uploads/'); }, 
  filename: (req, file, cb) => { cb(null, `${Date.now()}-${file.originalname}`); } 
});
const upload = multer({ storage });
const handleFileUploads = upload.fields([
  { name: 'files', maxCount: 10 },
  { name: 'utilityBills', maxCount: 1 },
  { name: 'certificateOfIncorporation', maxCount: 1 },
  { name: 'memat', maxCount: 1 },
  { name: 'operationLicense', maxCount: 1 }
]);

export const handleKYCData = [
  handleFileUploads,
  async (req: Request, res: Response) => {
    const { name, address, phoneNumber, dateOfBusinessIncorporation, userId } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const documents = [];
    if (files.files) {
      documents.push(...files.files.map(file => ({ fileType: 'general', filePath: file.filename })));
    }
    if (files.utilityBills) {
      documents.push({ fileType: 'utilityBills', filePath: files.utilityBills[0].filename });
    }
    if (files.certificateOfIncorporation) {
      documents.push({ fileType: 'certificateOfIncorporation', filePath: files.certificateOfIncorporation[0].filename });
    }
    if (files.memat) {
      documents.push({ fileType: 'memat', filePath: files.memat[0].filename });
    }
    if (files.operationLicense) {
      documents.push({ fileType: 'operationLicense', filePath: files.operationLicense[0].filename });
    }

    console.log('Documents:', documents);
    console.log('Other Details:', { name, address, phoneNumber, dateOfBusinessIncorporation });

    try {
      const userRepository = getRepository(User);
      const kycDocumentRepository = getRepository(KycDocument);

      const user = await userRepository.findOne({ where: { id: parseInt(userId, 10) } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newKycDocument = kycDocumentRepository.create({
        user, // Assign the User entity
        documents
      });

      await kycDocumentRepository.save(newKycDocument);
      console.log('Data saved to MongoDB:', newKycDocument);
      res.status(200).json({ message: 'KYC data received and saved' });
    } catch (error) {
      console.error('Error saving data to MongoDB:', error);
      res.status(500).json({ message: 'Error saving data' });
    }
  }
];


// interface AdminDetails {
//   name?: string;
//   role?: string;
//   // ... other properties
// }

// interface AdminUpdateBody {
//   adminId: string;
//   adminDetails: AdminDetails;
// }

// export const updateAdminDetails = async (req: Request<{}, {}, AdminUpdateBody>, res: Response): Promise<void> => {
//   const userRepository = getRepository(User);

//   try {
//     const { adminId, adminDetails } = req.body;
//     const admin = await userRepository.findOne({ where: { id: parseInt(adminId, 10) } });

//     if (!admin) {
//       res.status(404).json({ message: 'Admin not found' });
//       return;
//     }

//     userRepository.merge(admin, { adminDetails });
//     await userRepository.save(admin);

//     res.status(200).json({ 
//       message: 'Admin details updated successfully', 
//       admin 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       message: 'Error updating admin details', 
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// };

