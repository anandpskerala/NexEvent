import Redis from 'ioredis';
import { config } from '.';

const redis = new Redis(config.db.redis);

export default redis;