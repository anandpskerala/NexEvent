export interface IWallet {
    id?: string
    userId: string;
    balance: number;
    transactions: IWalletTransaction[];
}

export interface IWalletTransaction {
    id: string;
    type: 'CREDIT' | 'DEBIT' | 'REFUND';
    amount: number;
    description?: string;
    date: Date;
}