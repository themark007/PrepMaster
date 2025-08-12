import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import planRoutes from './routes/planRoutes.js';
import { Strategy } from 'passport-google-oauth2';
import GoogleStrategy from 'passport-google-oauth2'
import passport from 'passport';




dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));



// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the PrepMaster API!');
});

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes );


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
