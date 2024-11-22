import cors from 'cors';

const corsMiddleware = cors({
  origin: ['http://localhost:5173', 'https://enterprisepro-frontend-demo.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  optionsSuccessStatus: 200 
});

export default corsMiddleware;
