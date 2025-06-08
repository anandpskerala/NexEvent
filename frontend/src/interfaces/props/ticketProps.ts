export interface ResTicketProps {
    id: string;
    name: string;
    description: string;
    price: number;
    tickets: number;
    quantity: number;
    currency: string;
    onChange: (ticketId: string, value: number, price: number, name: string) => void;
}
