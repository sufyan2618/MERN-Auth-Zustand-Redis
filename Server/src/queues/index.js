import {queue as bullQueue} from 'bullmq';
import {redisConnection} from '../config/redis.js';
import {emailQueueName} from '../config/index.js';


const defaultQueueOptions = {
  connection: redisConnection,
};
export const emailQueue = new bullQueue(emailQueueName, defaultQueueOptions);