import { createClient } from 'redis';

const redisConnection = createClient({
  url: process.env.REDIS_URL,
});

redisConnection.on('error', (err) => console.log('Redis Client Error', err));

await redisConnection.connect();

export { redisConnection };