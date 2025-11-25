import { Worker } from 'bullmq';
import { redisConnection } from '../lib/redis.js';
import { emailQueueName } from '../config/index.js';
import { sendEmail } from '../services/emailService.js';

export const emailWorker = new Worker(  
    emailQueueName,
    async job => {
        const { to, subject, html } = job.data;
        console.log(`sending email to ${to}`);
        return await sendEmail(to, subject, html);
    },
    { connection: redisConnection }
);

