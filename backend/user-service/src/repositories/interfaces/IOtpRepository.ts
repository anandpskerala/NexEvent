import { IOtp } from "../../shared/types/otp";

export interface IOtpRepository {
    findOtp(userId: string, otp?: number): Promise<IOtp | undefined>;
    findByID(id: string): Promise<IOtp | undefined>;
    create(item: Partial<IOtp>): Promise<IOtp>;
    update(id: string, item: Partial<IOtp>): Promise<void>;
    delete(id: string): Promise<void>;
}