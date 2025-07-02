import React from 'react'
import { Minus, Plus } from 'lucide-react'
import type { ResTicketProps } from '../../interfaces/props/ticketProps'

export const TicketCard: React.FC<ResTicketProps> = ({
    id, name, description, price, tickets = 0, quantity, currency, onChange
}) => {
    return (
        <div className="border rounded-lg p-4 mt-4 mb-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{name}</h3>
                <span className="font-semibold">
                    {price === 0 ? 'Free' : `${currency == "INR" ? '₹': '$'}${price.toFixed(2)}`}
                </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{description}</p>

            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{quantity} tickets remaining</span>
                <div className="flex items-center space-x-2">
                    <button
                        className={`border rounded p-1 text-gray-600 disabled:opacity-50 ${tickets === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => onChange(id, Math.max(0, tickets - 1), price, name)}
                        disabled={tickets === 0}
                    >
                        <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{tickets || 0}</span>
                    <button
                        className={`border rounded p-1 text-gray-600 disabled:opacity-50 ${tickets >= quantity ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => onChange(id, Math.min(10, tickets + 1), price, name)}
                        disabled={tickets >= quantity}
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
