"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import mongoose, { Document, Schema } from 'mongoose';
const mongoose_1 = __importStar(require("mongoose"));
// Define the Mongoose schema for the User model
const userSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true, // Add createdAt and updatedAt timestamps
});
// Create the User model
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
