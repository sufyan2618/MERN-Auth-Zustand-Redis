import Redis from 'ioredis';
import { ENV } from '../util/dotenv.js';

const redisConnection = new Redis(ENV.REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    enableReadyCheck: true,
    lazyConnect: false
});

redisConnection.on('error', (err) => {
    console.log('Redis Client Error', err);
});

redisConnection.on('connect', () => {
    console.log('Redis connected successfully');
});