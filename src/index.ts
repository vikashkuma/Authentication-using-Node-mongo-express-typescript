// console.log("Hello, World!");

// configure express server

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import http from 'http';
import mongoose from 'mongoose';
import router from './router';


const app = express();

app.use(cors({
    credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

app.use('/',router);

// Define a route for GET /
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Catch-all for undefined routes
app.use((req, res) => {
    res.status(404).send('Not Found');
});

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

const mongoUrl = 'mongodb+srv://rajavicky007_db_user:KtE8HKfy9YoAvoyL@cluster0.g1dgqyk.mongodb.net/';

mongoose.Promise = Promise;

mongoose.connect(mongoUrl);

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error: ' + err);
});
