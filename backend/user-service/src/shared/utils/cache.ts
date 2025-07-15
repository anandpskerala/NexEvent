import redis from "../../config/redisClient";

export const setCache = async <T>(key: string, value: T, expiry = 3600) => {
  const serialized = JSON.stringify(value, (_, v) =>
    typeof v === "bigint" ? v.toString() : v
  );
  await redis.set(key, serialized, "EX", expiry);
}

export const getCache = async <T>(key: string): Promise<T | null> => {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
};

export const deleteCache = async (key: string) => {
  await redis.del(key);
};