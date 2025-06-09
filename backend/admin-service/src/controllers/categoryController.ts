import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";
import { ICategory } from "../shared/types/ICategory";

export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    public createCategory = async (req: Request, res: Response): Promise<void> => {
        const { name, description, image } = req.body;
        const result = await this.categoryService.createCategory(name, description, image);
        res.status(result.status).json({message: result.message});
    }

    public getCategory = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const result = await this.categoryService.getCategory(id);
        res.status(result.status).json({message: result.message, category: result.category});
    }

    public getCategories = async (req: Request, res: Response): Promise<void> => {
        const { search = "", page = 1, limit = 10 } = req.query;
        const result = await this.categoryService.getCategories(search as string, page as number, limit as number);
        res.status(result.status).json({
            message: result.message,
            total: result.total,
            page: result.page,
            pages: result.pages,
            categories: result.categories
        })
    }

    public updateCategory = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const { name, description, image } = req.body;
        const data: ICategory = {
            id,
            name,
            description,
            image
        }
        const result = await this.categoryService.updateCategory(data);
        res.status(result.status).json({message: result.message});
    }

    public deleteCategory = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const result = await this.categoryService.deleteCategory(id);
        res.status(result.status).json({message: result.message});
    }
}