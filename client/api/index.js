import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { connectDB } = require('../server/config/db.js');
const dataService = require('../server/services/dataService.js');
const authRoutes = require('../server/routes/authRoutes.js');
const leaveRoutes = require('../server/routes/leaveRoutes.js');
const employeeRoutes = require('../server/routes/employeeRoutes.js');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB connection for every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    await dataService.seedMongoIfEmpty();
    next();
  } catch (err) {
    console.error('Database connection error in serverless function:', err);
    next();
  }
});

// Support both /api/... and direct /... routing on Vercel
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/leaves', '/leaves'], leaveRoutes);
app.use(['/api/employees', '/employees'], employeeRoutes);

app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'LeaveFlow Vercel Serverless API'
  });
});

export default async function handler(req, res) {
  return app(req, res);
}
