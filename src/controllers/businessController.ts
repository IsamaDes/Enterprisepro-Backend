import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Business } from '../entity/Business';

export const createBusiness = async (req: Request, res: Response) => {
  const { name, contactPerson, email, phoneNumber, location } = req.body;
  const businessRepository = getRepository(Business);

  try {
    const business = businessRepository.create({
      name,
      contactPerson,
      email,
      phoneNumber,
      location
    });
    await businessRepository.save(business);
    res.status(201).json({ message: 'Business created successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Error creating business', error });
  }

  

};


export const getBusiness = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);  
  const businessRepository = getRepository(Business);

  try {
    const business = await businessRepository.findOne({ where: { id } });   
     if (!business) {
      res.status(404).json({ message: 'Business not found' });
      return;
    }
    res.status(200).json({ business });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business', error });
  }
};



export const updateBusiness = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);   
  const updateData = req.body; 
   const businessRepository = getRepository(Business); 
   try { 
    const business = await businessRepository.findOne({ where: { id } }); 
    if (!business) { 
      res.status(404).json({ message: 'Business not found' }); 
      return; } businessRepository.merge(business, updateData); 
      await businessRepository.save(business); 
      res.status(200).json({ message: 'Business updated successfully', business }); 
    } catch (error) { 
      res.status(500).json({ message: 'Error updating business', error }); 
    }
   };



      export const deleteBusiness = async (req: Request, res: Response): Promise<void> => { 
        const id = parseInt(req.params.id, 10);   
        const businessRepository = getRepository(Business); 
        try { 
          const business = await businessRepository.findOne({ where: { id } }); 
          if (!business) { 
            res.status(404).json({ message: 'Business not found' }); 
            return; }
             await businessRepository.remove(business); 
             res.status(200).json({ message: 'Business deleted successfully' });
             } catch (error) { res.status(500).json({ message: 'Error deleting business', error }); } };