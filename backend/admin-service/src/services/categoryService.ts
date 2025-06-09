import { StatusCode } from "../shared/constants/statusCode";
import { CloudinaryService } from "../shared/utils/cloudinary";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ICategory } from "../shared/types/ICategory";
import { CategoryPaginationType, CategoryReturnType } from "../shared/types/returnTypes";

export class CategoryService {
    private cloudinary: CloudinaryService;
    constructor(private categoryRepo: CategoryRepository) {
        this.cloudinary = new CloudinaryService();
    }

    public async createCategory(name: string, description: string, image: string): Promise<CategoryReturnType> {
        try {
            if (!name || name.trim() === "" || !description || description.trim() === "" || !image || image.trim() === "") {
                return {
                    message: "Fill all the required fields",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const existing = await this.categoryRepo.findByName(name);
            if (existing) {
                return {
                    message: "There is already a category with the same name",
                    status: StatusCode.BAD_REQUEST
                }
            }

            await this.categoryRepo.createCategory(name, description, image);
            return {
                message: "Category created",
                status: StatusCode.CREATED
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getCategory(id: string): Promise<CategoryReturnType> {
        try {
            if (!id || id.trim() === "") {
                return {
                    message: "Category ID not found",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const category = await this.categoryRepo.findByID(id);
            return {
                message: "Category fetched",
                status: StatusCode.OK,
                category: category ? category : undefined
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getCategories(name: string, page: number, limit: number): Promise<CategoryPaginationType> {
        try {
            const result = await this.categoryRepo.findAll(name, page, limit);
            return {
                message: "Fetched the categories",
                status: StatusCode.OK,
                total: result.total,
                page,
                pages: Math.ceil(result.total / limit),
                categories: result.items
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async updateCategory(category: ICategory): Promise<CategoryReturnType> {
        try {
            const existing = await this.categoryRepo.findByID(category.id as string);
            if (!existing) {
                return {
                    message: "Category doesn't exists",
                    status: StatusCode.NOT_FOUND
                }
            }

            if (existing.image !== category.image) {
                this.cloudinary.deleteImage(existing.image);
            }

            await this.categoryRepo.updateCategory(category);
            return {
                message: "Category updated",
                status: StatusCode.OK
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async deleteCategory(id: string): Promise<CategoryReturnType> {
        try {
            const existing = await this.categoryRepo.findByID(id);
            if (!existing) {
                return {
                    message: "Category doesn't exists",
                    status: StatusCode.NOT_FOUND
                }
            }

            await this.cloudinary.deleteImage(existing.image);
            await this.categoryRepo.deleteCategory(id);
            return {
                message: "Category deleted",
                status: StatusCode.OK
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}