import { IOtpRepository } from '../interfaces/IOtpRepository';
import { IOtp } from '../../shared/types/IOtp';
import redis from '../../config/redisClient';
import { v4 as uuid } from 'uuid';

export class OtpRepository implements IOtpRepository {
    private readonly TTL_SECONDS = 5 * 60;
    private getKey(userId: string): string {
        return `otp:${userId}`;
    }

    async findOtp(userId: string, otp?: number): Promise<IOtp | undefined> {
        const key = this.getKey(userId);
        const data = await redis.get(key);
        if (!data) return undefined;

        const parsed: IOtp = JSON.parse(data);
        if (otp !== undefined && Number(parsed.otp) !== Number(otp)) return undefined;
        return parsed;
    }

    async findByID(id: string): Promise<IOtp | undefined> {
        const keys = await redis.keys('otp:*');
        for (const key of keys) {
            const val = await redis.get(key);
            if (!val) continue;
            const otp: IOtp = JSON.parse(val);
            if (otp.id === id) return otp;
        }
        return undefined;
    }

    async create(item: Partial<IOtp>): Promise<IOtp> {
        const now = new Date();
        const expiry = new Date(now.getTime() + this.TTL_SECONDS * 1000);
        const otp: IOtp = {
            id: uuid(),
            userId: item.userId!,
            otp: item.otp!,
            expiry,
            createdAt: now.toISOString(),
        };

        const key = this.getKey(otp.userId);
        await redis.set(key, JSON.stringify(otp), 'EX', this.TTL_SECONDS);
        return otp;
    }

    async update(id: string, item: Partial<IOtp>): Promise<void> {
        const keys = await redis.keys('otp:*');
        for (const key of keys) {
            const val = await redis.get(key);
            if (!val) continue;
            const existing: IOtp = JSON.parse(val);
            if (existing.id === id) {
                const updated: IOtp = {
                    ...existing,
                    ...item,
                    expiry: item.expiry ?? existing.expiry,
                    createdAt: existing.createdAt,
                };
                const ttl = Math.floor((new Date(updated.expiry).getTime() - Date.now()) / 1000);
                if (ttl > 0) {
                    await redis.set(key, JSON.stringify(updated), 'EX', ttl);
                } else {
                    await redis.del(key);
                }
                break;
            }
        }
    }

    async delete(id: string): Promise<void> {
        const keys = await redis.keys('otp:*');
        for (const key of keys) {
            const val = await redis.get(key);
            if (!val) continue;
            const otp: IOtp = JSON.parse(val);
            if (otp.id === id) {
                await redis.del(key);
                break;
            }
        }
    }
}
