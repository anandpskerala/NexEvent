import { Types } from "mongoose";

export interface IWallet {
    id?: string
    userId: string;
    balance: number;
    transactions: IWalletTransaction[];
}

export enum TransactionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  REFUND = "REFUND",
}

export interface IWalletTransaction {
    id: string;
    walletId: Types.ObjectId;
    type: TransactionType;
    amount: number;
    description?: string;
    date: Date;
}