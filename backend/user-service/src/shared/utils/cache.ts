import redis from "../../config/redisClient";

export const setCache = async <T>(key: string, data: T, ttl = 60) => {
  await redis.set(key, JSON.stringify(data), 'EX', ttl);
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
};

export const deleteCache = async (key: string) => {
  await redis.del(key);
};