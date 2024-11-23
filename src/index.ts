import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';  
import businessRoutes from './routes/businessRoutes';
import loginRoute from './routes/loginRoute';
import authRoutes from './routes/authRoutes';  
import corsMiddleware from './middleware/corsMiddleware';
import UserModel from './entity/UserModel';
import KycDocument from './entity/KycDocument';
import Business from './entity/Business';
import {DataSource} from 'typeorm'

dotenv.config();

const app = express();

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


// Garbage collection (optional, remove if unnecessary)
setInterval(() => { 
  if (global.gc) { 
    global.gc(); 
  } else { 
    console.warn('Garbage collection is not exposed');
  } 
}, 60000);

// Middleware
// CORS middleware to handle pre-flight requests
app.options('*', cors(corsOptions)); // Allow pre-flight requests for all routes
app.use(express.json());
app.use('/api/business', businessRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', loginRoute);

app.get('/', (req: Request, res: Response) => { res.send('Welcome to the API'); });

app.get('/health-check', (req: Request, res: Response) => { res.send('OK'); });

// MongoDB connection with Mongoose
mongoose.connect(process.env.MONGO_URI || '', {
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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {   
  console.error("Unhandled error:", err.stack); 
  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message
  });
});




const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGO_URI,
  ssl: false, 
  synchronize: true,
  logging: true,
  entities: [
    UserModel,
    Business,
    KycDocument,
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