import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './Routes/authRoutes.js';
import memberRoutes from './Routes/memberRoutes.js';
import profileRoutes from './Routes/profileRoutes.js';
import { swaggerSpec, swaggerUi } from './Utils/Swagger.js';

const app = express();

app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Swagger Route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/profile', profileRoutes);

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: "OK" });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'مسیر یافت نشد' });
});

export default app;
