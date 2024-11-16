import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface for the User document
export interface IUser extends Document {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  role: 'admin' | 'user'; // or any other roles you want to define
}

// Define the Mongoose schema for the User model
const userSchema: Schema = new Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure emails are unique
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // You can adjust the minimum password length
    },
    role: {
      type: String,
      enum: ['admin', 'user'], // You can expand this list based on your roles
      default: 'user', // Default role is user if not specified
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

// Create the User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
