"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const businessRoutes_1 = __importDefault(require("./routes/businessRoutes"));
const loginRoute_1 = __importDefault(require("./routes/loginRoute"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const db_1 = __importDefault(require("./config/db")); // Assuming your DB connection setup
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize")); // Assuming you're using express-mongo-sanitize
const passport_1 = __importDefault(require("passport")); // If using Passport.js for authentication
const sanitizeInputs_1 = __importDefault(require("./middleware/sanitizeInputs")); // Custom input sanitization middleware
const logRequest_1 = __importDefault(require("./middleware/logRequest")); // Custom request logging middleware
const confirmation_1 = __importDefault(require("./routes/confirmation"));
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
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET || 'defaultSecret')); // Use a secret for cookie parsing
app.use((0, helmet_1.default)()); // Security middleware that sets HTTP headers to secure your app
app.use(sanitizeInputs_1.default); // Custom input sanitization (ensure you're using this middleware)
app.use((0, express_mongo_sanitize_1.default)()); // Prevent NoSQL injection attacks by sanitizing user inputs
app.use(logRequest_1.default); // Custom logging middleware for requests
app.use(passport_1.default.initialize()); // Initialize Passport for authentication
// Setup compression with a custom filter for the "x-no-compression" header
const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        // Don't compress responses if the header is present
        return false;
    }
    return compression_1.default.filter(req, res); // Default compression filter
};
app.use((0, compression_1.default)({ filter: shouldCompress })); // Enable response compression
// Middleware for parsing incoming JSON requests
app.use(express_1.default.json()); // Parse incoming JSON requests
// CORS middleware to handle pre-flight requests
app.options('*', (0, cors_1.default)(corsOptions)); // Allow pre-flight requests for all routes
app.use(express_1.default.json());
app.use('/api/business', businessRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/confirmation', confirmation_1.default);
app.use('/api', loginRoute_1.default);
app.get('/', (req, res) => { res.send('Welcome to the API'); });
app.get('/health-check', (req, res) => { res.send('OK'); });
(0, db_1.default)();
// Error Handling Middleware 
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        details: err.message
    });
});
// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
