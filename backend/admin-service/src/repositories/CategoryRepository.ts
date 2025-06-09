import { Model } from "mongoose";
import categoryModel from "../models/categoryModel";
import { ICategory } from "../shared/types/ICategory";
import { ICategoryRepository } from "./interfaces/ICategoryRepository";

export class CategoryRepository implements ICategoryRepository {
    private model: Model<ICategory>;

    constructor() {
        this.model = categoryModel;
    }

    async createCategory(name: string, description: string, image: string): Promise<ICategory> {
        const doc = await this.model.create({
            name,
            description,
            image
        });
        return doc.toJSON();
    }

    async findByID(id: string): Promise<ICategory | undefined> {
        const doc = await this.model.findOne({ _id: id });
        return doc?.toJSON();
    }

    async findByName(name: string): Promise<ICategory | undefined> {
        const doc = await this.model.findOne({ name: { $regex: name, $options: "i" } });
        return doc?.toJSON();
    }

    async findAll(name?: string, page?: number, limit?: number): Promise<{ items: ICategory[]; total: number }> {
        const query = this.model.find({name : {$regex: name, $options: "i"}});

        if (page && limit) {
            const skip = (page - 1) * limit;
            query.skip(skip).limit(limit);
        }

        const [docs, total] = await Promise.all([
            query.sort({ createdAt: -1 }),
            this.model.countDocuments({})
        ]);

        const items = docs.map(doc => doc.toJSON());

        return { items, total };
    }


    async updateCategory(category: ICategory): Promise<void> {
        const id = category.id;
        await this.model.updateOne({ _id: id }, { $set: { name: category.name, description: category.description, image: category.image } });
    }

    async deleteCategory(id: string): Promise<void> {
        await this.model.deleteOne({ _id: id });
    }
}