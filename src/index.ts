import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import businessRoutes from './routes/businessRoutes';
import loginRoute from './routes/loginRoute';
import authRoutes from './routes/authRoutes'; 
import connectDB from './config/db'; // Assuming your DB connection setup
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize'; // Assuming you're using express-mongo-sanitize
import passport from 'passport'; // If using Passport.js for authentication
import sanitizeInputs from './middleware/sanitizeInputs'; // Custom input sanitization middleware
import logRequest from './middleware/logRequest'; // Custom request logging middleware
import confirmationRoutes from './routes/confirmation';



dotenv.config();

const app: Application = express();


// Log incoming request headers
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Incoming request headers:', req.headers);
  next(); // Pass control to the next middleware or route handler
});


const corsOptions = {
  origin: ['http://localhost:5173', 'https://enterprisepro-frontend.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET || 'defaultSecret')); // Use a secret for cookie parsing
app.use(helmet()); // Security middleware that sets HTTP headers to secure your app
app.use(sanitizeInputs); // Custom input sanitization (ensure you're using this middleware)
app.use(mongoSanitize()); // Prevent NoSQL injection attacks by sanitizing user inputs
app.use(logRequest); // Custom logging middleware for requests
app.use(passport.initialize()); // Initialize Passport for authentication


// Setup compression with a custom filter for the "x-no-compression" header
const shouldCompress = (req: Request, res: Response) => {
  if (req.headers['x-no-compression']) {
      // Don't compress responses if the header is present
      return false;
  }
  return compression.filter(req, res); // Default compression filter
};

app.use(compression({ filter: shouldCompress })); // Enable response compression

// Middleware for parsing incoming JSON requests
app.use(express.json()); // Parse incoming JSON requests

// CORS middleware to handle pre-flight requests
app.options('*', cors(corsOptions)); // Allow pre-flight requests for all routes
app.use(express.json());
app.use('/api/business', businessRoutes);
app.use('/api/auth', authRoutes);
app.use('/confirmation', confirmationRoutes);
app.use('/api', loginRoute);

app.get('/', (req: Request, res: Response) => { res.send('Welcome to the API'); });

app.get('/health-check', (req: Request, res: Response) => { res.send('OK'); });


connectDB();

// Error Handling Middleware 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {   
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