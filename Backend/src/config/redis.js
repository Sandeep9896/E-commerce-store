import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-16684.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 16684
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();
console.log('Redis connected successfully');

export default client;