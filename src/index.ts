import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { register, login, getProfile, updateProfile, deleteUser } from './controllers/userController';
import { authenticate } from './middleware/auth';

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

const MONGO_URI = 'mongodb+srv://rajavicky007_db_user:KtE8HKfy9YoAvoyL@cluster0.g1dgqyk.mongodb.net/';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => console.log('Server running on port 3000'));
    })
    .catch(err => console.error('DB Connection Error:', err));
