import { ICategory } from "../../shared/types/ICategory";

export interface ICategoryRepository {
    createCategory(name: string, description: string, image: string): Promise<ICategory>;
    findByID(id: string): Promise<ICategory | undefined>;
    findByName(name: string): Promise<ICategory | undefined>;
    findAll(name?: string, page?: number, limit?: number): Promise<{ items: ICategory[], total: number }>;
    updateCategory(category: ICategory): Promise<void>;
    deleteCategory(id: string): Promise<void>
}