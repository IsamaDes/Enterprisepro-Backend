import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface for the Business document
export interface IBusiness extends Document {
  name: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  location: string;
}

// Define the Mongoose schema for the Business model
const businessSchema: Schema = new Schema(
  {
    name: {
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
      unique: true,  // Ensure the email is unique
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Business model
const Business = mongoose.model<IBusiness>('Business', businessSchema);

export default Business;
