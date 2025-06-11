import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '../../interfaces/entities/user';
import axiosInstance from '../../utils/axiosInstance';
import type { Message } from '../../interfaces/entities/Message';
import { formatDateTime } from '../../utils/stringUtils';
import { ImageIcon, MoreVertical, Search, SendHorizontal, X } from 'lucide-react';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { useDebounce } from '../../hooks/useDebounce';
import { useChatSocket } from '../../hooks/useChatSocket';
import { v4 as uuidv4 } from 'uuid';

export const MessageComponent = ({ user, selected }: { user: User, selected: User | null }) => {
    const [chats, setChats] = useState<User[]>([]);
    const [selectedChat, setSelectedChat] = useState<User | null>(selected);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const sentMessageIdsRef = useRef<Set<string>>(new Set());

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file?.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendMessage = async () => {
        if ((!newMessage.trim() && !selectedImage) || !selectedChat) return;

        try {
            let mediaUrl: string | undefined = undefined;

            if (selectedImage) {
                mediaUrl = await uploadToCloudinary(selectedImage);
            }

            const optimisticId = uuidv4();

            const messageData = {
                id: optimisticId,
                sender: user.id,
                receiver: selectedChat.id,
                content: newMessage || (mediaUrl ? 'Image' : ''),
                media: mediaUrl,
                createdAt: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, messageData]);
            sentMessageIdsRef.current.add(optimisticId);
            scrollToBottom();

            axiosInstance.post("/messages/chat", {
                ...messageData,
                id: undefined
            });

            setNewMessage('');
            handleRemoveImage();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const fetchUsers = async (query = '') => {
        try {
            const res = await axiosInstance.get(`/user/users?query=${query}&myId=${user.id}`);
            if (res.data) setChats(res.data.users);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchMessages = async (receiverId: string) => {
        try {
            const res = await axiosInstance.get(`/messages/conversations/${receiverId}`);
            setMessages(res.data?.messages || []);
            scrollToBottom();
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };


    const handleIncomingMessage = useCallback((msg: Message) => {
        if (sentMessageIdsRef.current.has(msg.id)) return;
        if (msg.sender !== selectedChat?.id) return;
        if (msg.sender === user.id) return;
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
    }, [selectedChat]);

    useChatSocket(user.id, handleIncomingMessage);

    useEffect(() => {
        fetchUsers(debouncedSearch);
    }, [debouncedSearch]);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);
        }
    }, [selectedChat]);

    return (
        <div className="flex w-full bg-gray-100 min-h-160">
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => {
                                if (selectedChat?.id !== contact.id) {
                                    setSelectedChat(contact);
                                }
                            }}
                            className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${selectedChat?.id === contact.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''}`}
                        >
                            <div className="relative w-12 h-12">
                                {contact.image ? (
                                    <img 
                                        src={contact.image}
                                        className='w-full h-full rounded-full'
                                    />
                                ):(
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {contact.firstName?.charAt(0)}
                                </div>
                                )}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                                        {contact.firstName}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {
                                selectedChat?.image ? (
                                    <img src={selectedChat.image} alt="user icon" className='w-full h-full rounded-full' />
                                ): (
                                    <span> {selectedChat?.firstName?.charAt(0) || 'A'} </span>
                                )
                            }
                        </div>
                        <div className="ml-3">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {selectedChat?.firstName || 'Select a user'}
                            </h2>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="flex-1 max-h-dvh md:max-h-125 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md rounded-2xl ${message.sender === user.id ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-gray-200 text-gray-800 rounded-bl-sm'} ${message.media ? 'p-2' : 'px-4 py-2'}`}>
                                {message.media && (
                                    <div className="mb-2">
                                        <img
                                            src={message.media}
                                            alt="Shared"
                                            className="max-w-full h-auto rounded-lg"
                                            style={{ maxHeight: '200px' }}
                                        />
                                    </div>
                                )}
                                <p className="text-md">{message.content}</p>
                                <p className={`text-xs text-right mt-1 ${message.sender === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {formatDateTime(message.createdAt as string)}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {imagePreview && (
                    <div className="bg-white border-t border-gray-200 p-4">
                        <div className="relative inline-block">
                            <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg border border-gray-300" />
                            <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {selectedChat && (
                    <div className="bg-white border-t border-gray-200 p-4">
                        <div className="flex items-center gap-5">
                            <div className="flex-1 relative">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="w-full mt-2 px-4 py-2 pr-12 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={1}
                                    style={{ minHeight: '40px', maxHeight: '120px' }}
                                />
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                <button onClick={() => fileInputRef.current?.click()} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
                                    <ImageIcon className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() && !selectedImage}
                                className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full transition-colors"
                            >
                                <SendHorizontal className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
