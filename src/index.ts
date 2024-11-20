import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import businessRoutes from './routes/businessRoutes';
import loginRoute from './routes/loginRoute';
import authRoutes from './routes/authRoutes';





dotenv.config();


const app = express();

setInterval(() => { if (global.gc) { global.gc(); } else { console.warn('Garbage collection is not exposed'); } }, 60000);

// Middleware
app.use(bodyParser.json());

app.use(cors({ 
  
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  optionsSuccessStatus: 200 
  }));

app.use(express.json());
app.use('/api/business', businessRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', loginRoute);







  mongoose
  .connect("mongodb://localhost:27017/enterprisepro",
    
    {
    
    serverSelectionTimeoutMS: 30000, 
  socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error: Error) => console.error("MongoDB connection failed:", error));

  


// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));