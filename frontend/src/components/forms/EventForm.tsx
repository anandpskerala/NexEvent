import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, Image, X } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { EventFormSkeleton } from '../skeletons/EventsFormSkeleton';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { AxiosError } from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';
import type { EventFormProps } from '../../interfaces/props/formProps';
import type { EventData } from '../../interfaces/entities/FormState';
import type { Category } from '../../interfaces/entities/category';
import type { EventErrorState } from '../../interfaces/entities/ErrorState';
import config from '../../config/config';
import { validateEvent } from '../../interfaces/validators/eventValidator';



export const EventForm: React.FC<EventFormProps> = ({ user, initialData, isEdit = false }) => {
    const [event, setEvent] = useState<EventData>({
        id: initialData?.id || "",
        title: initialData?.title || "",
        description: initialData?.description || "",
        eventType: initialData?.eventType || "offline",
        category: initialData?.category || "",
        image: initialData?.image || null,
        tags: initialData?.tags || [],
        eventFormat: initialData?.eventFormat || "single",
        location: initialData?.location,
        startDate: initialData?.startDate,
        endDate: initialData?.endDate,
        startTime: initialData?.startTime,
        endTime: initialData?.endTime
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image as string || null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [newTag, setNewTag] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [errors, setErrors] = useState<EventErrorState>({});
    const imageRef = useRef<HTMLInputElement>(null);


    const mapCenter = { lat: event.location?.coordinates[1] || 12.073057115312984, lng: event.location?.coordinates[0] || 75.57390941383983 };

    const navigate = useNavigate();

    const handleEventForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEvent((prev: EventData) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEvent((prev: EventData) => ({
            ...prev,
            location: {
                ...prev.location,
                place: e.target.value,
                coordinates: prev.location?.coordinates || []
            }
        }));
    }

    const handleFormClick = (name: string, value: string) => {
        setEvent((prev: EventData) => ({
            ...prev,
            [name]: value
        }))
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setEvent((prev) => ({
            ...prev,
            image: file
        }));
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        }
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setPreviewUrl(null);
        setEvent((prev: EventData) => ({ ...prev, image: null }));
        if (imageRef.current) {
            imageRef.current.value = '';
        }
    };

    const addTag = () => {
        if (newTag.trim()) {
            setEvent((prev: EventData) => ({
                ...prev,
                tags: [...new Set([...prev.tags, newTag.trim()])]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setEvent((prev: EventData) => ({
            ...prev,
            tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
        }))
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const createEvent = async () => {
        setErrors({});
        setProcessing(true);
        try {
            await validateEvent(event);
            let image = event.image;
            if (event.image && event.image instanceof File) {
                image = await uploadToCloudinary(event.image)
            }
            let method = axiosInstance.post;
            let url = "/event/event";
            let navUrl = "/organizer/create-ticket"
            if (isEdit) {
                method = axiosInstance.patch;
                url = `event/event/${event.id}`;
                navUrl = "/organizer/edit-ticket"
            }
            const res = await method(url, { ...event, image: image, userId: user.id });
            if (res.data) {
                navigate(`${navUrl}/${res.data.event}`);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message);
            }

            if (error instanceof yup.ValidationError) {
                const errorMap: EventErrorState = {};
                error.inner.forEach(e => {
                    if (e.path) errorMap[e.path] = e.message;
                });
                setErrors(errorMap);
            }
        } finally {
            setProcessing(false);
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/admin/categories`);
                setCategories(res.data.categories);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return <EventFormSkeleton />;
    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <APIProvider apiKey={config.map.apiKey}>
            <form className="mb-8 px-0 md:px-10">
                <h2 className="text-lg font-semibold mb-4">Event Type</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div
                        className={`flex-1 p-4 border rounded-lg cursor-pointer ${event.eventType === 'offline' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onClick={() => handleFormClick('eventType', 'offline')}
                    >
                        <div className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="eventType"
                                checked={event.eventType === 'offline'}
                                className="mr-2"
                                value="offline"
                                readOnly
                            />
                            <span className="font-medium">Offline</span>
                        </div>
                        <p className="text-sm text-gray-500">Physical venue with attendees present</p>
                    </div>

                    <div
                        className={`flex-1 p-4 border rounded-lg cursor-pointer ${event.eventType === 'virtual' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onClick={() => handleFormClick('eventType', 'virtual')}
                    >
                        <div className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="eventType"
                                checked={event.eventType === 'virtual'}
                                className="mr-2"
                                value="virtual"
                                readOnly
                            />
                            <span className="font-medium">Virtual</span>
                        </div>
                        <p className="text-sm text-gray-500">Online event with video conferencing</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-2">Event Category</h2>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                type="button"
                                className={`px-4 py-1 text-sm rounded-full cursor-pointer ${event.category === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                onClick={() => handleFormClick("category", category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    {errors.category && <p className="mt-2 text-sm text-red-500">{errors.category}</p>}
                </div>


                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-6">Basic Information</h2>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Event Title*
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={event.title}
                            onChange={handleEventForm}
                            placeholder="Give your event a clear, descriptive name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Event Description*
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={event.description}
                            onChange={handleEventForm}
                            placeholder="Tell potential attendees what your event is about"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-32"
                        ></textarea>
                        {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Event Banner Image
                        </label>
                        <div
                            className={`border-2 border-dashed ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} rounded-lg p-6 text-center cursor-pointer hover:border-blue-300 ${imageRef.current?.value ? 'bg-blue-200' : 'bg-white'}`}
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => imageRef.current?.click()}
                        >
                            {previewUrl ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img
                                        src={previewUrl}
                                        alt="Category icon preview"
                                        className=" max-w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                        className="absolute -top-3 -right-3 bg-red-100 text-red-500 p-1 rounded-full hover:bg-red-200 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) :
                                (<div className="flex flex-col items-center">
                                    <Image className="mb-2 text-gray-400" size={32} />
                                    <p className="mb-2 text-sm text-gray-600">Drag & drop an image or</p>
                                    <span className="text-blue-600 font-medium">click to browse</span>
                                    <p className="mt-2 text-xs text-gray-400">Recommended size: 1920 x 1080 px</p>
                                    <input className="hidden" type="file" name="image" id="image" ref={imageRef} onChange={handleFileInput} />
                                </div>
                                )}
                        </div>
                        {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}
                    </div>

                    {event.eventType === "offline" && (
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">
                                Location*
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={event.location?.place}
                                onChange={handleLocation}
                                placeholder="Exact location of the event"
                                className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors["location.place"] && <p className="mt-2 m-2 text-sm text-red-500">{errors["location.place"]}</p>}
                            <Map
                                defaultCenter={mapCenter}
                                defaultZoom={10}
                                gestureHandling="greedy"
                                disableDefaultUI={false}
                                clickableIcons={true}
                                mapTypeControl={true}
                                className='w-full h-[30vh] md:h-[70vh]'
                                mapId="default"
                                onDblclick={(e) => setEvent((prev: EventData) => ({
                                    ...prev,
                                    location: {
                                        ...prev.location,
                                        coordinates: [e.detail.latLng?.lng as number,  e.detail.latLng?.lat as number]
                                        // lat: e.detail.latLng?.lat,
                                        // lng: e.detail.latLng?.lng
                                    }
                                }))}
                            >
                                {event.location && (
                                    <Marker position={{ lat: event.location.coordinates[1] || 12.073057115312984, lng: event.location.coordinates[0] || 75.57390941383983 }} />
                                )}
                            </Map>
                            {(errors["location.lat"] || errors["location.lng"]) && <p className="mt-2 text-sm text-red-500">{errors["location.lng"] || errors["location.lat"]}</p>}
                        </div>
                    )}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Tags</h2>
                        <p className="text-sm text-gray-500 mb-2">Add keywords</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                            {event.tags.map(tag => (
                                <div key={tag} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1">
                                    <span className="text-sm mr-1">{tag}</span>
                                    <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add a tag and press Enter"
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="ml-2 bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded-lg cursor-pointer"
                            >
                                Add
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Help people find your event</p>
                        {errors.tags && <p className="mt-2 m-2 text-sm text-red-500">{errors.tags}</p>}
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Date & Time</h2>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium">
                                Event Format*
                            </label>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div
                                    className={`flex-1 p-4 border rounded-lg cursor-pointer ${event.eventFormat === 'single' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                    onClick={() => handleFormClick("eventFormat", "single")}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={event.eventFormat === 'single'}
                                            className="mr-2"
                                            readOnly
                                        />
                                        <span className="font-medium">Single Day</span>
                                    </div>
                                </div>
                                <div
                                    className={`flex-1 p-4 border rounded-lg cursor-pointer ${event.eventFormat === "multiple" ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                    onClick={() => handleFormClick("eventFormat", 'multiple')}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={event.eventFormat === 'multiple'}
                                            className="mr-2"
                                            readOnly
                                        />
                                        <span className="font-medium">Multiple Days</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 ${event.eventFormat === 'single' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                            {event.eventFormat === 'single' ? (
                                <>
                                    <div>
                                        <label className="block mb-2 font-medium">Date*</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="startDate"
                                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                value={event.startDate ? new Date(event.startDate).toISOString().split("T")[0] : ""}
                                                onChange={handleEventForm}
                                            />
                                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                        </div>
                                        {errors.startDate && <p className="mt-2 m-2 text-sm text-red-500">{errors.startDate}</p>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block mb-2 font-medium">Start Date*</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="startDate"
                                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                value={event.startDate ? new Date(event.startDate).toISOString().split("T")[0] : ""}
                                                onChange={handleEventForm}
                                            />
                                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                        </div>
                                        {errors.startDate && <p className="mt-2 m-2 text-sm text-red-500">{errors.startDate}</p>}
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-medium">End Date*</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="endDate"
                                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                value={event.endDate ? new Date(event.endDate).toISOString().split("T")[0] : ""}
                                                onChange={handleEventForm}
                                            />
                                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                        </div>
                                        {errors.endDate && <p className="mt-2 m-2 text-sm text-red-500">{errors.endDate}</p>}
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block mb-2 font-medium">Start Time*</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="startTime"
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={event.startTime}
                                        onChange={handleEventForm}
                                    />
                                    <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                                </div>
                                {errors.startTime && <p className="mt-2 m-2 text-sm text-red-500">{errors.startTime}</p>}
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">End Time*</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="endTime"
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={event.endTime}
                                        onChange={handleEventForm}
                                    />
                                    <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                                </div>
                                {errors.endTime && <p className="mt-2 m-2 text-sm text-red-500">{errors.endTime}</p>}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <button
                        type="button"
                        className="border border-red-600 text-red-500 px-2 py-1 rounded-md cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`p-2 rounded-md text-white ${processing ? 'cursor-not-allowed bg-blue-700': 'cursor-pointer bg-blue-600'}`}
                        onClick={() => createEvent()}
                        disabled={processing}
                    >
                        {processing ? 'Saving ...': 'Next: Tickets'}
                    </button>
                </div>
            </form >
            </APIProvider>
        </div >
    )
}