import { createClient } from 'redis';

import dotenv from 'dotenv';
dotenv.config();

const userName = process.env.REDIS_NAME;
const password = process.env.REDIS_PASSWORD;

const redisClient = createClient({
    url: `redis://${userName}:${password}@redis-12652.c264.ap-south-1-1.ec2.cloud.redislabs.com:12652`
});

redisClient.on('error', (err:Error) => console.log({ err }));

(async () => await redisClient.connect())();

redisClient.on('ready', () => console.log('Redis connected successfully'));

export default redisClient;
