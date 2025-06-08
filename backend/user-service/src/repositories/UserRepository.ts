import { FilterQuery, Model } from "mongoose";
import { AllUsers, IUser } from "../shared/types/user";
import { IUserRepository } from "./interfaces/IUserRepository";
import userModel from "../models/userModel";

export class UserRepository implements IUserRepository {
    private readonly model: Model<IUser>;

    constructor() {
        this.model = userModel;
    }

    async findByID(id: string): Promise<IUser | undefined> {
        const doc = await this.model.findOne({ _id: id }).populate("organizer");
        return doc?.toJSON();
    }

    async findByEmail(email: string, authProvider?: string): Promise<IUser | undefined> {
        const query = {
            email: { $regex: `^${email}$`, $options: "i" },
            ...(authProvider && { authProvider }),
        };

        const doc = await this.model.findOne(query);
        return doc?.toJSON();
    }

    async create(item: Partial<IUser>): Promise<IUser> {
        const doc = await this.model.create(item);
        return doc.toJSON()
    }

    async update(id: string, item: Partial<IUser>): Promise<void> {
        await this.model.updateOne({_id: id}, {$set: item});
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({_id: id});
    }

    async getAllUsers(search: string, page: number, limit: number, role?: string, status?: string, myId?: string): Promise<AllUsers> {
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

        return {
            users,
            total
        }
    }

    async updateProfileImage(id: string, image: string): Promise<void> {
        await this.model.updateOne({ _id: id }, { $set: { image } });
    }

    async updateUser(email: string, firstName: string, lastName: string, phoneNumber: number, roles?: string[], isBlocked?: boolean): Promise<void> {
        await this.model.updateOne({ email }, { $set: { firstName, lastName, phoneNumber, roles, isBlocked } });
    }

    async addRole(id: string, role: string): Promise<void> {
        await this.model.updateOne({ _id: id }, { $addToSet: { roles: role } });
    }
}