import { v2 as cloud, UploadApiOptions, UploadApiResponse } from "cloudinary";
import { config } from "../../config";
import { injectable } from "tsyringe";
import { ICloudinaryService } from "../interfaces/ICloudinaryService";


@injectable()
export class CloudinaryService implements ICloudinaryService {
    private _cloud: typeof cloud;
    constructor() {
        cloud.config({
            cloud_name: config.cloudinary.cloudName,
            api_key: config.cloudinary.apiKey,
            api_secret: config.cloudinary.secret
        });
        this._cloud = cloud;
    }

    public async uploadImage(filePath: string, options?: UploadApiOptions): Promise<UploadApiResponse> {
        try {
            const result = await this._cloud.uploader.upload(filePath, options);
            return result;
        } catch (error) {
            console.error("Cloudinary upload failed:", error);
            throw new Error("Failed to upload image");
        }
    }

    public async deleteImage(url: string): Promise<{ result: string }> {
        try {
            const parts = url.split("/");
            const lastPart = parts[parts.length - 1];
            const publicId = lastPart.split(".")[0];
            return await this._cloud.uploader.destroy(publicId);
        } catch (error) {
            console.error("Cloudinary delete failed:", error);
            throw new Error("Failed to delete image");
        }
    }
}