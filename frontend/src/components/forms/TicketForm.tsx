import { ChevronDown, Plus } from 'lucide-react';
import React, { useState } from 'react'
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import type { TicketFormProps, TicketProps } from '../../interfaces/props/formProps';
import type { Ticket } from '../../interfaces/entities/FormState';
import type { TicketErrorState } from '../../interfaces/entities/ErrorState';

const ticketSchema = yup.object().shape({
    name: yup.string()
        .trim()
        .required("Ticket name is required"),
    type: yup.string()
        .oneOf(["free", "paid"])
        .required("Ticket type is required"),
    price: yup.number()
        .nullable()
        .when("type", {
            is: "paid",
            then: (schema) => schema.required("Price is required for paid tickets").min(0, "Price must be a positive number"),
            otherwise: (schema) => schema.notRequired(),
        }),
    quantity: yup.number()
        .typeError("Quantity must be a number")
        .required("Quantity is required"),
    description: yup.string()
        .trim()
        .required("Description is required"),
    startDate: yup.string()
        .required("Start date is required"),
    endDate: yup.string()
        .required("End date is required")
        .test("is-after-start", "End date must be after start date", function (value) {
            const { startDate } = this.parent;
            return !value || !startDate || new Date(value) > new Date(startDate);
        }),
});


const eventTicketSchema = yup.object().shape({
    currency: yup.string()
        .required("Currency is required"),
    entryType: yup.string()
        .oneOf(["free", "paid"])
        .required("Entry type is required"),
    showQuantity: yup.boolean().required(),
    refunds: yup.boolean().required(),
    tickets: yup.array()
        .of(ticketSchema)
        .min(1, "At least one ticket must be added"),
});

const TicketFormCard: React.FC<TicketProps> = ({ ticket, index, onChange, errors, canDelete = false, onDelete }) => {
    return (
        <div className="my-4 px-6 py-4 border border-gray-300 rounded-md">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="font-medium text-base">{ticket.name || `${ticket.type[0].toUpperCase()}${ticket.type.slice(1)} Ticket`}</div>
                    <div className="ml-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded text-center">{ticket.type}</div>
                </div>
                <button
                    type='button'
                    className={`text-sm cursor-pointer ${canDelete ? 'text-red-500' : 'text-gray-400'}`}
                    disabled={canDelete === false}
                    onClick={() => onDelete(index)}
                >
                    Delete
                </button>
            </div>

            <div className="mb-6">
                <label className="text-sm text-gray-800 mb-2">Ticket Name</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                    value={ticket.name}
                    onChange={(e) => onChange(index, "name", e.target.value)}
                    placeholder='Enter the name of the ticket'
                />
                {errors[`tickets[${index}].name`] && <p className="mt-2 text-sm text-red-500">{errors[`tickets[${index}].name`]}</p>}
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
                {ticket.price !== undefined && (
                    <div className="w-full md:w-1/2">
                        <div className="text-sm text-gray-800 mb-2">Price</div>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                            value={ticket.price}
                            onChange={(e) => onChange(index, "price", Number(e.target.value))}
                        />
                        {errors[`tickets[${index}].price`] && <p className="mt-2 text-sm text-red-500">{errors[`tickets[${index}].price`]}</p>}
                    </div>
                )}
                <div className="w-full md:w-1/2">
                    <div className="text-sm text-gray-800 mb-2">Available Quantity</div>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                        value={ticket.quantity}
                        onChange={(e) => onChange(index, "quantity", Number(e.target.value))}
                        placeholder='Enter quantity of the ticket'
                    />
                    {errors[`tickets[${index}].quantity`] && <p className="mt-2 text-sm text-red-500">{errors[`tickets[${index}].quantity`]}</p>}
                </div>
            </div>

            <div className="mb-6">
                <div className="text-sm text-gray-800 mb-2">Ticket Description</div>
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                    value={ticket.description}
                    onChange={(e) => onChange(index, "description", e.target.value)}
                    placeholder='Description of the ticket'
                />
                {errors[`tickets[${index}].description`] && <p className="mt-1 text-sm text-red-500">{errors[`tickets[${index}].description`]}</p>}
                <div className="text-xs text-gray-400 mt-1">Clearly explain what's included with this ticket</div>

            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-full md:w-1/2">
                    <div className="text-sm text-gray-800 mb-2">Sales Start Date</div>
                    <div className="relative">
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                            value={ticket.startDate ? new Date(ticket.startDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => onChange(index, "startDate", e.target.value)}
                        />
                        {errors[`tickets[${index}].startDate`] && <p className="mt-2 text-sm text-red-500">{errors[`tickets[${index}].startDate`]}</p>}
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <div className="text-sm text-gray-800 mb-2">Sales End Date</div>
                    <div className="relative">
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                            value={ticket.endDate ? new Date(ticket.endDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => onChange(index, "endDate", e.target.value)}
                        />
                        {errors[`tickets[${index}].endDate`] && <p className="mt-2 text-sm text-red-500">{errors[`tickets[${index}].endDate`]}</p>}
                    </div>
                </div>
            </div>

            <div className="mt-6 border-t border-dashed border-gray-200 pt-4"></div>
        </div>
    )
}


export const TicketForm: React.FC<TicketFormProps> = ({ initialData, isEdit = false }) => {
    const { id } = useParams();
    const [event, setEvent] = useState({
        currency: initialData?.currency || "",
        entryType: initialData?.entryType || "free",
        showQuantity: initialData?.showQuantity || true,
        refunds: initialData?.refunds || false
    });

    const [tickets, setTickets] = useState<Ticket[]>(initialData?.tickets || []);
    const [errors, setErrors] = useState<TicketErrorState>({});
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleFormClick = (name: string, value: string) => {
        setEvent((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    const handleEventForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
        setEvent((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const addTicket = () => {
        setTickets((tickets: Ticket[]) => (
            [
                ...tickets,
                {
                    id: uuidv4(),
                    name: "",
                    type: event.entryType,
                    price: event.entryType === "paid" ? 0 : undefined,
                    quantity: 0,
                    description: "",
                    startDate: new Date(),
                    endDate: new Date(),
                }
            ]
        ))
    };

    const handleTicketChange = (
        index: number,
        field: keyof Ticket,
        value: unknown
    ) => {
        setTickets((prevTickets) => {
            const updated = [...prevTickets];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleTicketDelete = (index: number) => {
        setTickets((prevTickets) => prevTickets.filter((_, i) => index != i))
    }

    const createTicket = async () => {
        setLoading(true);
        try {
            await eventTicketSchema.validate({ ...event, tickets }, { abortEarly: false, context: { type: event.entryType } });
            let method = axiosInstance.post;
            let url = "/event/ticket"
            if (isEdit) {
                method = axiosInstance.patch;
                url = `/event/ticket/${id}`;
            }
            const res = await method(url, { ...event, id, tickets })
            if (res.data) {
                toast.success(res.data.message);
                navigate("/organizer/events");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data.message);
            }

            if (error instanceof yup.ValidationError) {
                const errorMap: TicketErrorState = {};
                error.inner.forEach(e => {
                    if (e.path) errorMap[e.path] = e.message;
                });
                setErrors(errorMap);
            }
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <form className="mb-8 px-0 md:px-10">
                <div className="flex items-center mb-4">
                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg font-bold mr-3">
                        $
                    </div>
                    <span className="text-lg font-semibold">Ticket Settings</span>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="currency">Ticket Currency</label>
                    <div className="relative">
                        <select
                            name="currency"
                            id="currency"
                            value={event.currency}
                            onChange={handleEventForm}
                            className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select currency</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="INR">INR - Indian Rupee</option>
                        </select>
                        <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                    </div>
                    {errors.currency && <p className="mt-2 text-sm text-red-500">{errors.currency}</p>}
                </div>


                <h2 className="text-lg font-semibold mb-4">Event Type</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div
                        className={`flex-1 p-4 border rounded-lg cursor-pointer ${event.entryType === 'free' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onClick={() => handleFormClick('entryType', 'free')}
                    >
                        <div className="flex items-center mb-2 justify-center">
                            <input
                                type="radio"
                                name="entryType"
                                checked={event.entryType === 'free'}
                                className="mr-2 hidden"
                                value="free"
                                readOnly
                            />
                            <span className="font-medium">Free Entry</span>
                        </div>
                        <p className="text-sm text-gray-500 text-center">Users can attend free of cost</p>
                    </div>

                    <div
                        className={`flex-1 p-4 border rounded-lg cursor-pointer ${event.entryType === 'paid' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onClick={() => handleFormClick('entryType', 'paid')}
                    >
                        <div className="flex items-center mb-2 justify-center">
                            <input
                                type="radio"
                                name="entryType"
                                checked={event.entryType === 'paid'}
                                className="mr-2 hidden"
                                value="paid"
                                readOnly
                            />
                            <span className="font-medium">Paid Entry</span>
                        </div>
                        <p className="text-sm text-gray-500 text-center">Users should pay for tickets</p>
                    </div>
                    {errors.entryType && <p className="mt-2 text-sm text-red-500">{errors.entryType}</p>}
                </div>

                <div className="flex items-center py-4">
                    <div className="h-6 w-12 mr-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                name="showQuantity"
                                type="checkbox"
                                checked={event.showQuantity}
                                onChange={handleEventForm} className="sr-only peer"
                            />
                            <div className={`w-11 h-6 rounded-full peer border-2 border-gray-300 ${event.showQuantity ? 'bg-indigo-600' : 'bg-gray-200'} peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                    </div>
                    <div className="flex-1">
                        <div className="text-sm">Show remaining tickets</div>
                        <div className="text-xs text-gray-400 mt-0.5">Display ticket availability to attendees</div>
                    </div>
                </div>

                <div className="flex items-center py-4">
                    <div className="h-6 w-12 mr-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                name="refunds"
                                type="checkbox"
                                checked={event.refunds}
                                onChange={handleEventForm} className="sr-only peer"
                            />
                            <div className={`w-11 h-6 rounded-full peer border-2 border-gray-300 ${event.refunds ? 'bg-indigo-600' : 'bg-gray-200'} peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                    </div>
                    <div className="flex-1">
                        <div className="text-sm">Allow Refunds</div>
                        <div className="text-xs text-gray-400 mt-0.5">Enable ticket refunds up to 7 days before the event</div>
                    </div>
                </div>

                {tickets.map((ticket, index) => (
                    <TicketFormCard
                        key={index}
                        ticket={ticket}
                        index={index}
                        onChange={handleTicketChange}
                        errors={errors}
                        canDelete={tickets.length > 1}
                        onDelete={handleTicketDelete}
                    />
                ))}

                <div className="border border-dashed border-gray-400 rounded-lg py-2">
                    <div className="flex justify-center mt-6">
                        <span className="flex items-center justify-center text-indigo-600 font-medium text-sm">
                            <Plus size={18} className="mr-1" />
                            Add Another Ticket Type
                        </span>
                    </div>

                    <div className="flex justify-center mt-3 mb-6">
                        <button
                            type='button'
                            className="bg-indigo-600 text-white text-xs font-medium px-4 py-2 rounded cursor-pointer"
                            onClick={() => addTicket()}
                        >
                            Add Ticket
                        </button>
                    </div>
                </div>
                {errors[`tickets`] && <p className="mt-2 text-sm text-red-500">{errors[`tickets`]}</p>}
                <div className="flex flex-row justify-between items-center mt-4">
                    <button
                        type="button"
                        className="border border-red-600 text-red-500 px-2 py-1 rounded-md cursor-pointer"
                        onClick={() => navigate("/organizer/events")}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-md text-white ${loading ? 'cursor-not-allowed bg-blue-700' : 'cursor-pointer bg-blue-600'}`}
                        onClick={() => createTicket()}
                        disabled={loading}
                    >
                        {isEdit ? (loading ? 'Saving...' : 'Save') : (loading ? 'Publishing...' : 'Publish')}
                    </button>
                </div>
            </form>
        </div>
    )
}
