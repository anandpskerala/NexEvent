import { UploadApiOptions, UploadApiResponse } from "cloudinary";

export interface ICloudinaryService {
    uploadImage(filePath: string, options?: UploadApiOptions): Promise<UploadApiResponse>;
    deleteImage(url: string): Promise<{ result: string }>;
}