import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import {logger} from './logger.js';

const redis = new Redis();

// Global rate limiter (100 req/minute per IP)
export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: async (command, ...args) => redis.call(command, ...args),
    prefix: 'global:',
  }),
  handler: (req, res) => {
    logger.warn(`Global rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ error: 'Too many requests' });
  },
});

// auth rate limiter (10 req/minute per IP)
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: async (command, ...args) => redis.call(command, ...args),
    prefix: 'auth:',
  }),
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ 
      error: 'Too many attempts. Try again later.' 
    });
  },
});
