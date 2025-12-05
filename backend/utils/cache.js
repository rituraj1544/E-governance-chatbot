// utils/cache.js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', { lazyConnect: true });

async function get(key) {
  await redis.connect().catch(()=>{});
  const val = await redis.get(key);
  return val ? JSON.parse(val) : null;
}

async function set(key, value, ttlSeconds = 300) {
  await redis.connect().catch(()=>{});
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

module.exports = { get, set, redisClient: redis };
