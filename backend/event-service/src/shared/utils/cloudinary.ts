import { v2 as cloud, UploadApiOptions, UploadApiResponse } from "cloudinary";
import { config } from "../../config";
import logger from "./logger";


export class CloudinaryService {
    private cloud: typeof cloud;
    constructor() {
        cloud.config({
            cloud_name: config.cloudinary.cloudName,
            api_key: config.cloudinary.apiKey,
            api_secret: config.cloudinary.secret
        });
        this.cloud = cloud;
    }

    public async uploadImage(filePath: string, options?: UploadApiOptions): Promise<UploadApiResponse> {
        try {
            const result = await this.cloud.uploader.upload(filePath, options);
            return result;
        } catch (error) {
            logger.error("Cloudinary upload failed:", error);
            throw new Error("Failed to upload image");
        }
    }

    public async deleteImage(url: string): Promise<{ result: string }> {
        try {
            const parts = url.split("/");
            const lastPart = parts[parts.length - 1];
            const publicId = lastPart.split(".")[0];
            return await this.cloud.uploader.destroy(publicId);
        } catch (error) {
            logger.error("Cloudinary delete failed:", error);
            throw new Error("Failed to delete image");
        }
    }
}