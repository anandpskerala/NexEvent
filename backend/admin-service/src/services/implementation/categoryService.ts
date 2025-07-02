import { StatusCode } from "../../shared/constants/statusCode";
import { CloudinaryService } from "../../shared/utils/cloudinary";
import { ICategory } from "../../shared/types/ICategory";
import { CategoryPaginationType, CategoryReturnType } from "../../shared/types/returnTypes";
import logger from "../../shared/utils/logger";
import { ICategoryRepository } from "../../repositories/interfaces/ICategoryRepository";
import { ICategoryService } from "../interfaces/ICategoryService";
import { HttpResponse } from "../../shared/constants/httpResponse";

export class CategoryService implements ICategoryService {
    private cloudinary: CloudinaryService;
    constructor(private categoryRepo: ICategoryRepository) {
        this.cloudinary = new CloudinaryService();
    }

    public async createCategory(name: string, description: string, image: string): Promise<CategoryReturnType> {
        try {
            if (!name || name.trim() === "" || !description || description.trim() === "" || !image || image.trim() === "") {
                return {
                    message: HttpResponse.MISSING_FIELDS,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const existing = await this.categoryRepo.findByName(name);
            if (existing) {
                return {
                    message: HttpResponse.CATEGORY_ALREADY_EXISTS,
                    status: StatusCode.BAD_REQUEST
                }
            }

            await this.categoryRepo.createCategory(name, description, image);
            return {
                message: HttpResponse.CATEGORY_CREATED,
                status: StatusCode.CREATED
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getCategory(id: string): Promise<CategoryReturnType> {
        try {
            if (!id || id.trim() === "") {
                return {
                    message: HttpResponse.CATEGORY_ID_NOT_FOUND,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const category = await this.categoryRepo.findByID(id);
            return {
                message: HttpResponse.CATEGORY_FETCHED,
                status: StatusCode.OK,
                category: category ? category : undefined
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getCategories(name: string, page: number, limit: number): Promise<CategoryPaginationType> {
        try {
            const result = await this.categoryRepo.findAll(name, page, limit);
            return {
                message: HttpResponse.CATEGORY_FETCHED,
                status: StatusCode.OK,
                total: result.total,
                page,
                pages: Math.ceil(result.total / limit),
                categories: result.items
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async updateCategory(category: ICategory): Promise<CategoryReturnType> {
        try {
            const existing = await this.categoryRepo.findByID(category.id as string);
            if (!existing) {
                return {
                    message: HttpResponse.CATEGORY_DOESNT_EXISTS,
                    status: StatusCode.NOT_FOUND
                }
            }

            if (existing.image !== category.image) {
                this.cloudinary.deleteImage(existing.image);
            }

            await this.categoryRepo.updateCategory(category);
            return {
                message: HttpResponse.CATEGORY_UPDATED,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async deleteCategory(id: string): Promise<CategoryReturnType> {
        try {
            const existing = await this.categoryRepo.findByID(id);
            if (!existing) {
                return {
                    message: HttpResponse.CATEGORY_DOESNT_EXISTS,
                    status: StatusCode.NOT_FOUND
                }
            }

            await this.cloudinary.deleteImage(existing.image);
            await this.categoryRepo.deleteCategory(id);
            return {
                message: HttpResponse.CATEGORY_DELETED,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}