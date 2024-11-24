"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminDetails = exports.updateDirectorDetails = exports.handleKYCData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../entity/User"));
const Business_1 = __importDefault(require("../entity/Business"));
const KycDocument_1 = __importDefault(require("../entity/KycDocument"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({ destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    } });
const upload = (0, multer_1.default)({ storage });
const handleFileUploads = upload.fields([{ name: 'files', maxCount: 10 },
    { name: 'utilityBills', maxCount: 1 },
    { name: 'certificateOfIncorporation', maxCount: 1 },
    { name: 'memat', maxCount: 1 },
    { name: 'operationLicense', maxCount: 1 }]);
exports.handleKYCData = [handleFileUploads, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, address, phoneNumber, dateOfBusinessIncorporation, userId } = req.body;
        const files = req.files;
        const documents = [];
        if (files.files) {
            documents.push(...files.files.map(file => ({
                fileType: 'general',
                filePath: file.filename
            })));
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
            const newKycDocument = new KycDocument_1.default({ userId: new mongoose_1.default.Types.ObjectId(userId),
                documents });
            yield newKycDocument.save();
            console.log('Data saved to MongoDB:', newKycDocument);
            res.status(200).json({ message: 'KYC data received and saved' });
        }
        catch (error) {
            console.error('Error saving data to MongoDB:', error);
            res.status(500).json({ message: 'Error saving data' });
        }
    })];
const updateDirectorDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessId, directorDetails } = req.body;
        const business = yield Business_1.default.findByIdAndUpdate(businessId, { directorDetails }, { new: true });
        if (!business) {
            res.status(404).json({ message: 'Business not found' });
            return;
        }
        res.status(200).json({
            message: 'Director details updated successfully',
            business
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating director details',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateDirectorDetails = updateDirectorDetails;
const updateAdminDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId, adminDetails } = req.body;
        const admin = yield User_1.default.findByIdAndUpdate(adminId, { adminDetails }, { new: true });
        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }
        res.status(200).json({
            message: 'Admin details updated successfully',
            admin
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating admin details',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateAdminDetails = updateAdminDetails;
