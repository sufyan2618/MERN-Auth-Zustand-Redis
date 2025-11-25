import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ENV } from './src/util/dotenv.js';
import { connectDB } from './src/lib/db.js';
import authRoutes from './src/routers/authRouter.js';
import { logger, morganMiddleware } from './src/config/logger.js';
import { globalRateLimiter, authRateLimiter } from './src/config/rateLimiting.js';

const app = express();
const PORT = ENV.PORT || 5000;

// Middleware
app.use(morganMiddleware);
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

// Apply global rate limiter to all routes
app.use(globalRateLimiter);
// Routes
app.use('/api/auth', authRateLimiter, authRoutes);


// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});


// Start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running on http://localhost:${PORT}`);
    });
});