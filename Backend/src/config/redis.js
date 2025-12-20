import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST || 'redis-16684.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: parseInt(process.env.REDIS_PORT) || 16684
    }
});
client.on('error', err => console.log('Redis Client Error', err));

await client.connect();
console.log('Redis connected successfully');

export default client;