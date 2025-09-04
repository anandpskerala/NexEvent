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

export const deleteCacheByPrefix = async (prefix: string): Promise<void> => {
	const stream = redis.scanStream({
		match: `${prefix}*`,
		count: 100,
	});

	stream.on("data", async (keys: string[]) => {
		if (keys.length) {
			await redis.del(...keys);
		}
	});

	return new Promise<void>((resolve, reject) => {
		stream.on("end", resolve);
		stream.on("error", reject);
	});
};