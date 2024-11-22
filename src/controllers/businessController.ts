import { Request, Response } from 'express';
import Business from '../entity/Business';

// Create Business
export const createBusiness = async (req: Request, res: Response) => {
  const { name, contactPerson, email, phoneNumber, location } = req.body;
  try {
    const business = new Business({ name, contactPerson, email, phoneNumber, location });
    await business.save();
    res.status(201).json({ message: 'Business created successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Error creating business', error });
  }
};

// Get Business
export const getBusiness = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const business = await Business.findById(id);
    if (!business) {
       res.status(404).json({ message: 'Business not found' });
    }
    res.status(200).json({ business });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business', error });
  }
};

// Update Business
export const updateBusiness = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const business = await Business.findByIdAndUpdate(id, updateData, { new: true });
    if (!business) {
     res.status(404).json({ message: 'Business not found' });
    }
    res.status(200).json({ message: 'Business updated successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Error updating business', error });
  }
};

// Delete Business
export const deleteBusiness = async (req: Request, res: Response): Promise<void>=> {
  const { id } = req.params;
  try {
    const business = await Business.findByIdAndDelete(id);
    if (!business) {
       res.status(404).json({ message: 'Business not found' });
    }
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting business', error });
  }
};
