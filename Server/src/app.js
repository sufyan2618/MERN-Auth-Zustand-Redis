import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ENV } from './util/dotenv.js';
import authRoutes from './routers/authRouter.js';
import { morganMiddleware } from './config/logger.js';
import { globalRateLimiter, authRateLimiter } from './config/rateLimiting.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

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


// Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;