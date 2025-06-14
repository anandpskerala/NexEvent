import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '../../interfaces/entities/user';
import axiosInstance from '../../utils/axiosInstance';
import type { Message } from '../../interfaces/entities/Message';
import { formatDateTime } from '../../utils/stringUtils';
import { MoreVertical, Search, SendHorizontal, X, ArrowLeft, Menu, Paperclip } from 'lucide-react';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showChatList, setShowChatList] = useState(true);
    // const [isTyping, setIsTyping] = useState(false);

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

    const handleChatSelect = (contact: User) => {
        if (selectedChat?.id !== contact.id) {
            setSelectedChat(contact);
            setShowChatList(false);
            setIsMobileMenuOpen(false);
        }
    };

    const handleBackToList = () => {
        setShowChatList(true);
        setSelectedChat(null);
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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowChatList(true);
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getGradientForUser = (name: string) => {
        const gradients = [
            'from-violet-500 to-purple-600',
            'from-blue-500 to-cyan-500',
            'from-emerald-500 to-teal-600',
            'from-orange-500 to-red-500',
            'from-pink-500 to-rose-600',
            'from-indigo-500 to-blue-600',
            'from-green-500 to-emerald-600',
            'from-yellow-500 to-orange-500'
        ];
        const index = name?.charCodeAt(0) % gradients.length || 0;
        return gradients[index];
    };

    return (
        <div className="flex w-full bg-gradient-to-br from-slate-50 to-gray-100 min-h-160 md:max-h-160 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className={`
                ${showChatList ? 'flex' : 'hidden'} 
                md:flex
                h-[640px]
                w-full md:w-80 lg:w-96
                backdrop-blur-xl bg-white/80 border-r border-gray-200/50 flex-col
                absolute md:relative
                z-10 md:z-auto
                shadow-xl md:shadow-none
                transition-all duration-300 ease-in-out
            `}>
                <div className="p-4 md:p-6 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4 md:hidden">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Messages
                        </h1>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 hover:bg-white/50 rounded-full transition-all duration-200 hover:scale-105"
                        >
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-blue-500" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-100/80 hover:bg-gray-100 focus:bg-white border border-transparent hover:border-gray-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none transition-all duration-200 placeholder-gray-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {chats.map((contact, index) => (
                        <div
                            key={contact.id}
                            onClick={() => handleChatSelect(contact)}
                            className={`flex items-center p-4 md:p-5 hover:bg-white/60 cursor-pointer border-b border-gray-100/50
                                transition-all duration-200 hover:scale-[1.02] hover:shadow-sm
                                ${selectedChat?.id === contact.id ? 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-r-4 border-r-blue-500 shadow-sm' : 'border-b-gray-400'}
                                animate-fadeIn
                            `}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="relative flex-shrink-0">
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105`}>
                                    {contact.image ? (
                                        <img 
                                            src={contact.image}
                                            alt={contact.firstName}
                                            className='w-full h-full object-cover'
                                        />
                                    ) : (
                                        <div className={`w-full h-full bg-gradient-to-br ${getGradientForUser(contact.firstName)} flex items-center justify-center text-white font-bold text-lg`}>
                                            {contact.firstName?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                                        {contact.firstName} {contact.lastName}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`
                ${!showChatList || selectedChat ? 'flex' : 'hidden'} 
                md:flex
                flex-1 flex-col
                w-full
                relative
            `}>
                <div className="backdrop-blur-xl bg-white/80 border-b border-gray-200/50 p-4 md:p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center">
                        <button
                            onClick={handleBackToList}
                            className="md:hidden mr-3 p-2 hover:bg-white/50 rounded-full transition-all duration-200 hover:scale-105"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        <div className="relative">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden shadow-lg flex-shrink-0`}>
                                {selectedChat?.image ? (
                                    <img 
                                        src={selectedChat.image} 
                                        alt={selectedChat.firstName} 
                                        className='w-full h-full object-cover' 
                                    />
                                ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${getGradientForUser(selectedChat?.firstName || 'A')} flex items-center justify-center text-white font-bold`}>
                                        {selectedChat?.firstName?.charAt(0) || 'A'}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="ml-4">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">
                                {selectedChat?.firstName || 'Select a conversation'}
                            </h2>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <button className="p-2 md:p-3 hover:bg-white/50 rounded-full transition-all duration-200 hover:scale-105">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scrollbar-hide">
                    {messages.map((message, index) => (
                        <div 
                            key={message.id} 
                            className={`flex ${message.sender === user.id ? 'justify-end' : 'justify-start'} animate-messageSlide`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`
                                max-w-[85%] sm:max-w-sm lg:max-w-md rounded-3xl shadow-lg backdrop-blur-sm
                                ${message.sender === user.id 
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-lg shadow-blue-500/25' 
                                    : 'bg-white/90 text-gray-800 rounded-bl-lg shadow-gray-500/10 border border-gray-200/50'
                                } 
                                ${message.media ? 'p-3' : 'px-4 py-3 md:px-5 md:py-4'}
                                transform transition-all duration-200 hover:scale-[1.02]
                            `}>
                                {message.media && (
                                    <div className="mb-3">
                                        <img
                                            src={message.media}
                                            alt="Shared"
                                            className="max-w-full h-auto rounded-2xl shadow-md"
                                            style={{ maxHeight: '200px' }}
                                        />
                                    </div>
                                )}
                                {message.content && (
                                    <p className="text-sm md:text-base break-words leading-relaxed">{message.content}</p>
                                )}
                                <p className={`
                                    text-xs text-right mt-2 opacity-75
                                    ${message.sender === user.id ? 'text-blue-100' : 'text-gray-500'}
                                `}>
                                    {formatDateTime(message.createdAt as string)}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {/* {isTyping && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="bg-white/90 rounded-3xl rounded-bl-lg px-5 py-3 shadow-lg border border-gray-200/50">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )} */}
                    
                    <div ref={messagesEndRef} />
                </div>

                {imagePreview && (
                    <div className="backdrop-blur-xl bg-white/80 border-t border-gray-200/50 p-4 md:p-6 animate-slideUp">
                        <div className="relative inline-block group">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="max-h-32 md:max-h-40 rounded-2xl border border-gray-200 shadow-lg" 
                            />
                            <button 
                                onClick={handleRemoveImage} 
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {selectedChat && (
                    <div className="backdrop-blur-xl bg-white/80 border-t border-gray-200 p-4 md:p-6">
                        <div className="flex items-end gap-3 md:gap-4">
                            <div className="flex-1 relative">
                                <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200/70 overflow-hidden hover:shadow-xl transition-all duration-200 focus-within:border-blue-500 focus-within:shadow-xl">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        className="w-full px-5 py-4 pr-20 resize-none focus:outline-none text-sm md:text-base placeholder-gray-400"
                                        rows={1}
                                        style={{ minHeight: '45px', maxHeight: '120px' }}
                                    />
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />
                                        <button 
                                            onClick={() => fileInputRef.current?.click()} 
                                            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                                        >
                                            <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() && !selectedImage}
                                className="p-3 md:p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 flex-shrink-0"
                            >
                                <SendHorizontal className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};