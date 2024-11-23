import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';  // Import mongoose
import businessRoutes from './routes/businessRoutes';
import loginRoute from './routes/loginRoute';
import authRoutes from './routes/authRoutes';  // Import the auth routes
import corsMiddleware from './middleware/corsMiddleware';
import UserModel from './entity/UserModel';
import KycDocument from './entity/KycDocument';
import Business from './entity/Business';
import {DataSource} from 'typeorm'

dotenv.config();

const app = express();

// Garbage collection (optional, remove if unnecessary)
setInterval(() => { 
  if (global.gc) { 
    global.gc(); 
  } else { 
    console.warn('Garbage collection is not exposed');
  } 
}, 60000);

// Middleware
app.use(express.json());
app.use(corsMiddleware);
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