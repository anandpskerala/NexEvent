import { ICategory } from "../../shared/types/ICategory";
import { CategoryPaginationType, CategoryReturnType } from "../../shared/types/returnTypes";

export interface ICategoryService {
    createCategory(name: string, description: string, image: string): Promise<CategoryReturnType>;
    getCategory(id: string): Promise<CategoryReturnType>;
    getCategories(name: string, page: number, limit: number): Promise<CategoryPaginationType>;
    updateCategory(category: ICategory): Promise<CategoryReturnType>;
    deleteCategory(id: string): Promise<CategoryReturnType>;
}