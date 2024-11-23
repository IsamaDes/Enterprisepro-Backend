"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const businessRoutes_1 = __importDefault(require("./routes/businessRoutes"));
const loginRoute_1 = __importDefault(require("./routes/loginRoute"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const UserModel_1 = __importDefault(require("./entity/UserModel"));
const KycDocument_1 = __importDefault(require("./entity/KycDocument"));
const Business_1 = __importDefault(require("./entity/Business"));
const typeorm_1 = require("typeorm");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Log incoming request headers
app.use((req, res, next) => {
    console.log('Incoming request headers:', req.headers);
    next(); // Pass control to the next middleware or route handler
});
const corsOptions = {
    origin: ['http://localhost:5173', 'https://enterprisepro-frontend.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
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
// CORS middleware to handle pre-flight requests
app.options('*', (0, cors_1.default)(corsOptions)); // Allow pre-flight requests for all routes
app.use(express_1.default.json());
app.use('/api/business', businessRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api', loginRoute_1.default);
app.get('/', (req, res) => { res.send('Welcome to the API'); });
app.get('/health-check', (req, res) => { res.send('OK'); });
// MongoDB connection with Mongoose
mongoose_1.default.connect(process.env.MONGO_URI || '', {
// useNewUrlParser: true,
// useUnifiedTopology: true,
})
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
    url: process.env.MONGO_URI,
    ssl: false,
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
const port = Number(process.env.PORT) || 5000;
if (isNaN(port)) {
    throw new Error('The port is not a valid number!');
}
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
