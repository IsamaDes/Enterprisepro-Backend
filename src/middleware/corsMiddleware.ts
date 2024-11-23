import cors from 'cors';

const corsMiddleware = cors({
  origin: [
    'http://localhost:5173', 
    'https://enterprisepro-frontend-demo.vercel.app', 
    'https://enterprisepro-frontend.onrender.com', 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Successful status code for OPTIONS pre-flight requests
});

export default corsMiddleware;
