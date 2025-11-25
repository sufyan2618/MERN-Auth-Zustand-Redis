import Redis from 'ioredis';
import { ENV } from '../util/dotenv.js';

const redisConnection = new Redis(ENV.REDIS_URL, {
    maxRetriesPerRequest: null
});

redisConnection.on('error', (err) => console.log('Redis Client Error', err));

export { redisConnection };