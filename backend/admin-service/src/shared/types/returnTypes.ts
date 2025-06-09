import { StatusCode } from "../constants/statusCode";
import { ICategory } from "./ICategory";

export interface CategoryReturnType {
    message: string;
    status: StatusCode;
    category?: ICategory
}

export interface CategoryPaginationType {
    message: string;
    status: StatusCode;
    categories?: ICategory[];
    total?: number;
    page?: number;
    pages?: number; 
}