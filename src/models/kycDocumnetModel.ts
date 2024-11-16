import mongoose, {Document, Schema} from 'mongoose';

// Define TypeScript interface for the KYC Document
export interface IKycDocument extends Document {
  userId: mongoose.Types.ObjectId;
  documents: {
    fileType: string;
    filePath: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema for KYC Document
const kycDocumentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documents: [
      {
        fileType: { type: String, required: true },
        filePath: { type: String, required: true }
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Create the KYC Document model
const KycDocument = mongoose.model<IKycDocument>('KycDocument', kycDocumentSchema);

export default KycDocument;
