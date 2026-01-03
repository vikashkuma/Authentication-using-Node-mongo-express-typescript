import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { register, login, getProfile, updateProfile, deleteUser } from './controllers/userController';
import { authenticate } from './middleware/auth';

import dotenv from 'dotenv';
dotenv.config();

// Now you can access them via process.env
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI as string;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Public Routes
app.post('/auth/register', register);
app.post('/auth/login', login);

// Protected CRUD Routes
app.get('/user/profile', authenticate, getProfile);
app.put('/user/profile', authenticate, updateProfile);
app.delete('/user/profile', authenticate, deleteUser);

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch(err => console.error('DB Connection Error:', err));
