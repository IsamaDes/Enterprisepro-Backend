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
// routes/confirmation.ts
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../entity/User"));
const router = express_1.default.Router();
router.get('/confirmation/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Confirmation route hit'); // Log for debugging
        const { token } = req.params;
        console.log('Token:', token); // Log token for debugging
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const userId = decoded.id;
        if (!userId) {
            console.error('Invalid token');
            return res.status(400).send('Invalid token');
        }
        yield User_1.default.findByIdAndUpdate(userId, { isVerified: true });
        console.log('User verified:', userId); // Log user ID for debugging
        return res.status(200).send('Email confirmed');
    }
    catch (err) {
        console.error('Error during confirmation:', err); // Log error for debugging
        return res.status(400).send('Invalid token');
    }
}));
exports.default = router;
