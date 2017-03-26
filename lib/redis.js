const Redis = require('redis');

const redis = Redis.createClient({
  host: process.env.REDISHOST || undefined,
  port: process.env.REDISPORT || undefined
});

//const REDIS_SESSION_KEY_PREFIX = 'session';

module.exports = redis;
