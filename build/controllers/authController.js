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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
// Registration
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessName, contactPerson, email, phone, location, password } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new userModel_1.default({
            businessName,
            contactPerson,
            email,
            phone,
            location,
            password: hashedPassword,
            role: 'admin'
        });
        yield user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});
exports.register = register;
// Login
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email }).exec();
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.login = login;
// Reset Password
// export const resetPassword = async (req: Request, res: Response): Promise<Response | void> => {
//      const { token } = req.params; 
//      const { newPassword } = req.body; 
//      try { 
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken; 
//         const user = await User.findById(decoded.userId); 
//         if (!user) { return res.status(404).json({ message: 'User not found' }); } 
//         const hashedPassword = await bcrypt.hash(newPassword, 10); 
//         user.password = hashedPassword; 
//         await user.save(); 
//         return res.status(200).json({ message: 'Password reset successfully' }); 
//     } catch (error) { return res.status(400).json({ message: 'Invalid or expired token', error }); } };
