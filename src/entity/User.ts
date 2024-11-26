import mongoose, { Document, Schema } from "mongoose";

export interface IUser  extends Document{
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  _id: string;
  isVerified: { type: Boolean, default: false };
}

const UserSchema = new Schema<IUser>({

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
});

const User = mongoose.model<IUser>("User", UserSchema);


export default User;
