import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../entity/User';
import { generateToken } from '../utils/jwtUtils';  // Import the generateToken function

// Register user (example)
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
  const { businessName, contactPerson, email, phone, location, password  } = req.body;

  console.log('Received data:', req.body);


  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    businessName,
    contactPerson,
    email,
    phone,
    location,
    password: hashedPassword,
  });

  
    await newUser.save();

    // Generate JWT token after user is created
    const token = generateToken(newUser._id.toString());

    return res.status(201).json({
      message: 'User registered successfully',
      token, // Send the token back to the client
      user: { id: newUser._id.toString(), name: newUser.businessName, email: newUser.email }, // Customize as needed

    });
  } catch (error: unknown) {
    console.error('Error during registration:', error); // Log the full error
    
    // Check if error is an instance of Error before accessing its message
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } else {
      return res.status(500).json({ error: 'Internal Server Error', details: 'Unknown error occurred' });
    }
  }
};





















// // Login
// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   try {
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
//       expiresIn: '1h',
//     });
//     res.status(200).json({ message: 'Login successful', token });
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging in', error });
//   }
// };





// // Reset Password
//  export const resetPassword = async (req: Request, res: Response) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;
//   try {
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
//     const user = await UserModel.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();
//     res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid or expired token', error });
//   }
// };

