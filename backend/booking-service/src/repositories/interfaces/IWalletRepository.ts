import { IWallet } from "../../shared/types/IWallet";

export interface IWalletRepository {
    findByUserID(userId: string): Promise<IWallet | undefined>;
    checkBalance(userId: string, amount: number): Promise<boolean>;
    debit(id: string, amount: number): Promise<string | undefined>;
    credit(userId: string, amount: number): Promise<string | undefined>;
    findByID(id: string): Promise<IWallet | undefined>;
    create(item: Partial<IWallet>): Promise<IWallet>;
    update(id: string, item: Partial<IWallet>): Promise<void>;
    delete(id: string): Promise<void>;
}