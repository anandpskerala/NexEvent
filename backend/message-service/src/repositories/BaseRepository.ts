import { Model } from "mongoose";

export abstract class BaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async findByID(id: string): Promise<T | undefined> {
        const doc = await this.model.findOne({ _id: id });
        return doc?.toJSON() as T;
    }

    async create(item: Partial<T>): Promise<T> {
        const doc = await this.model.create(item);
        return doc.toJSON() as T;
    }

    async update(id: string, item: Partial<T>): Promise<void> {
        await this.model.updateOne({ _id: id }, { $set: item });
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({ _id: id });
    }
}