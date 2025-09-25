import { IWallet, IWalletTransaction } from "../types/IWallet";

export interface WalletDTO {
    id: string
    userId: string;
    balance: number;
    transactions: IWalletTransaction[];
}

export const toWalletDTO =(entity: IWallet): WalletDTO => {
    return {
        id: entity.id as string,
        userId: entity.userId,
        balance: entity.balance,
        transactions: entity.transactions
    }
}