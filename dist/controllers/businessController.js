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
exports.deleteBusiness = exports.updateBusiness = exports.getBusiness = exports.createBusiness = void 0;
const Business_1 = __importDefault(require("../entity/Business"));
// Create Business
const createBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, contactPerson, email, phoneNumber, location } = req.body;
    try {
        const business = new Business_1.default({ name, contactPerson, email, phoneNumber, location });
        yield business.save();
        res.status(201).json({ message: 'Business created successfully', business });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating business', error });
    }
});
exports.createBusiness = createBusiness;
// Get Business
const getBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const business = yield Business_1.default.findById(id);
        if (!business) {
            res.status(404).json({ message: 'Business not found' });
        }
        res.status(200).json({ business });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching business', error });
    }
});
exports.getBusiness = getBusiness;
// Update Business
const updateBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const business = yield Business_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!business) {
            res.status(404).json({ message: 'Business not found' });
        }
        res.status(200).json({ message: 'Business updated successfully', business });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating business', error });
    }
});
exports.updateBusiness = updateBusiness;
// Delete Business
const deleteBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const business = yield Business_1.default.findByIdAndDelete(id);
        if (!business) {
            res.status(404).json({ message: 'Business not found' });
        }
        res.status(200).json({ message: 'Business deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting business', error });
    }
});
exports.deleteBusiness = deleteBusiness;
