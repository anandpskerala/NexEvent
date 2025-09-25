import { ICategory } from "../types/ICategory";

export interface CategoryDTO {
	id: string;
	name: string;
	description: string;
	image: string;
	isBlocked: boolean;
	createdAt: string;
	updatedAt: string;
}

export const toCategoryDTO = (entity: ICategory): CategoryDTO => {
	return {
		id: entity.id as string,
		name: entity.name,
		description: entity.description,
		image: entity.image,
		isBlocked: entity.isBlocked as boolean,
		createdAt: entity.createdAt as string,
		updatedAt: entity.updatedAt as string
	};
}