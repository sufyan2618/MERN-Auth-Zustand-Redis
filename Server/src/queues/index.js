import {Queue} from 'bullmq';
import {redisConnection} from '../lib/redis.js';
import {emailQueueName} from '../config/index.js';


const defaultQueueOptions = {
  connection: redisConnection,
};
export const emailQueue = new Queue(emailQueueName, defaultQueueOptions);