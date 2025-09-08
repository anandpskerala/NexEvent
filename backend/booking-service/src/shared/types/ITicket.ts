export interface ITicket {
    id: string;
    name: string;
    type: string;
    price: number;
    quantity: number;
    description: string;
    startDate: Date;
    endDate: Date;
}