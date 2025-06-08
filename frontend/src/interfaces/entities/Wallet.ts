export interface Wallet {
    id: string
    userId: string;
    balance: number;
    transactions: WalletTransaction[];
}

export interface WalletTransaction {
    id: string;
    type: 'CREDIT' | 'DEBIT' | 'REFUND';
    amount: number;
    description: string;
    date: Date;
}