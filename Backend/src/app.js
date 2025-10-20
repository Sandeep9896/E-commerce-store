import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';
import sellerRoutes from './routes/sellerRoute.js';
import adminRoutes from './routes/adminRoute.js';
import productRoutes from './routes/productRoute.js';

// Load environment variables first

dotenv.config();

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow the specific origin that made the request
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // These are crucial for cookies
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 
    'Origin,X-Requested-With,Content-Type,Accept,Authorization,ngrok-skip-browser-warning');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;