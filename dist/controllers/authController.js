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
exports.resetPassword = exports.login = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../entity/User"));
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
// Register user (example)
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessName, contactPerson, email, phone, location, password } = req.body;
        console.log('Received data:', req.body);
        // Check if user already exists
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create new user
        const newUser = new User_1.default({
            businessName,
            contactPerson,
            email,
            phone,
            location,
            password: hashedPassword,
        });
        yield newUser.save();
        // const token = generateToken(newUser._id.toString());
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const url = `https://enterprisepro-frontend.onrender.com/confirmation/${token}`;
        yield nodemailer_1.default.sendMail({ to: email, subject: 'Confirm your email', html: `Please click this link to confirm your email: <a href="${url}">${url}</a>` });
        return res.status(201).json({
            message: 'User registered successfully. Please check your email to confirm your registration.',
            token, // Send the token back to the client
            user: { id: newUser._id.toString(), name: newUser.businessName, email: newUser.email },
        });
    }
    catch (error) {
        console.error('Error during registration:', error); // Log the full error
        // Check if error is an instance of Error before accessing its message
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
        else {
            return res.status(500).json({ error: 'Internal Server Error', details: 'Unknown error occurred' });
        }
    }
});
exports.registerUser = registerUser;
// Login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.login = login;
// Reset Password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield User_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid or expired token', error });
    }
});
exports.resetPassword = resetPassword;
