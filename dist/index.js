"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose")); // Import mongoose
const businessRoutes_1 = __importDefault(require("./routes/businessRoutes"));
const loginRoute_1 = __importDefault(require("./routes/loginRoute"));
const authController_1 = require("./controllers/authController");
const corsMiddleware_1 = __importDefault(require("./middleware/corsMiddleware"));
const UserModel_1 = __importDefault(require("./entity/UserModel"));
const KycDocument_1 = __importDefault(require("./entity/KycDocument"));
const Business_1 = __importDefault(require("./entity/Business"));
const typeorm_1 = require("typeorm");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Garbage collection (optional, remove if unnecessary)
setInterval(() => {
    if (global.gc) {
        global.gc();
    }
    else {
        console.warn('Garbage collection is not exposed');
    }
}, 60000);
// Middleware
app.use(express_1.default.json());
app.use(corsMiddleware_1.default);
app.use('/api/business', businessRoutes_1.default);
app.post('/api/auth/register', authController_1.register);
app.use('/api', loginRoute_1.default);
app.get('/', (req, res) => { res.send('Welcome to the API'); });
app.get('/health-check', (req, res) => { res.send('OK'); });
// MongoDB connection with Mongoose
mongoose_1.default.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/enterpriseapp', {})
    .then(() => {
    console.log('MongoDB connected');
})
    .catch((error) => {
    console.error('Error during MongoDB connection', error);
});
// Error Handling Middleware 
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        details: err.message
    });
});
const AppDataSource = new typeorm_1.DataSource({
    type: 'mongodb',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    entities: [
        UserModel_1.default,
        Business_1.default,
        KycDocument_1.default,
        ...(process.env.NODE_ENV === 'production' ? ['./dist/entity/*.js'] : ['./src/entity/*.ts']),
    ],
});
AppDataSource.initialize()
    .then(() => {
    console.log('MongoDB connected');
})
    .catch((error) => {
    console.error('Error during DataSource initialization:', error);
});
// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
