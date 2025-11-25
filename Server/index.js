import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ENV } from './src/util/dotenv.js';
import { connectDB } from './src/lib/db.js';
import authRoutes from './src/routers/authRouter.js';

const app = express();
const PORT = ENV.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    { 
        origin: ENV.CLIENT_URL, 
        credentials: true,
        optionsSuccessStatus: 200,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    }
));

// Routes
app.use('/api/auth', authRoutes);


// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});


// Start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});