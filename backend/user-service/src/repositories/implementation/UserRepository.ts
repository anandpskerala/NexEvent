import { FilterQuery, Model } from "mongoose";
import { AllUsers, IUser } from "../../shared/types/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import userModel from "../../models/userModel";
import { deleteCache, getCache, setCache } from "../../shared/utils/cache";

export class UserRepository implements IUserRepository {
    private readonly model: Model<IUser>;

    constructor() {
        this.model = userModel;
    }

    async findByID(id: string): Promise<IUser | undefined> {
        const cacheKey = `user:id:${id}`;
        const cached = await getCache<IUser>(cacheKey);
        if (cached) return cached;

        const doc = await this.model.findOne({ _id: id }).populate("organizer");
        if (doc) await setCache(cacheKey, doc.toJSON());
        return doc?.toJSON();
    }

    async findByEmail(email: string, authProvider?: string): Promise<IUser | undefined> {
        const cacheKey = `user:email:${email}:${authProvider ?? "any"}`;
        const cached = await getCache<IUser>(cacheKey);
        if (cached) return cached;

        const query = {
            email: { $regex: `^${email}$`, $options: "i" },
            ...(authProvider && { authProvider }),
        };

        const doc = await this.model.findOne(query);
        if (doc) await setCache(cacheKey, doc.toJSON());
        return doc?.toJSON();

    }

    async create(item: Partial<IUser>): Promise<IUser> {
        const doc = await this.model.create(item);
        await deleteCache(`user:email:${doc.email}:${item.authProvider ?? "any"}`);
        return doc.toJSON()
    }

    async update(id: string, item: Partial<IUser>): Promise<void> {
        await this.model.updateOne({_id: id}, {$set: item});
        await deleteCache(`user:id:${id}`);
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({_id: id});
        await deleteCache(`user:id:${id}`);
    }

    async getAllUsers(search: string, page: number, limit: number, role?: string, status?: string, myId?: string): Promise<AllUsers> {
        const cacheKey = `user:list:${search}:${page}:${limit}:${role}:${status}:${myId}`;
        const cached = await getCache<AllUsers>(cacheKey);
        if (cached) return cached;

        const skip = (page - 1) * limit;
        const query: FilterQuery<IUser> = {};
        if (search?.trim()) {
            const regex = { $regex: search.trim(), $options: 'i' };
            query.$or = [
                { email: regex },
                { firstName: regex },
                { lastName: regex }
            ];
        }
        if (role && role !== "") {
            query.roles = { $in: [role] };
        }

        if (status === "blocked") {
            query.isBlocked = true;
        } else if (status === "active") {
            query.isBlocked = false;
        }

        if (myId) {
            query._id = { $ne: myId };
        }

        const total = await this.model.countDocuments(query);
        const users = await this.model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
        const result = { users: users.map(u => u.toJSON()), total };
        await setCache(cacheKey, result, 300);

        return result;
    }

    async updateProfileImage(id: string, image: string): Promise<void> {
        await this.model.updateOne({ _id: id }, { $set: { image } });
        await deleteCache(`user:id:${id}`);
    }

    async updateUser(email: string, firstName: string, lastName: string, phoneNumber: number, roles?: string[], isBlocked?: boolean): Promise<void> {
        await this.model.updateOne({ email }, { $set: { firstName, lastName, phoneNumber, roles, isBlocked } });
        await deleteCache(`user:email:${email}:any`);
    }

    async addRole(id: string, role: string): Promise<void> {
        await this.model.updateOne({ _id: id }, { $addToSet: { roles: role } });
        await deleteCache(`user:id:${id}`);
    }

    async getBulkUsers(ids: string[]): Promise<IUser[]> {
        const docs = (await this.model.find({ _id: { $in: ids } }).select('_id firstName lastName image')).map(doc => doc.toJSON());
        return docs;
    }
}