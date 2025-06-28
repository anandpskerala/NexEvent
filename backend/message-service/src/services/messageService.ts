import axios from "axios";
import { StatusCode } from "../shared/constants/statusCode";
import { config } from "../config";
import { ChatRepository } from "../repositories/ChatRepository";
import { Message } from "../shared/types/Message";
import { KafkaProducer } from "../kafka/producer";
import kafka from "../kafka";
import { TOPICS } from "../kafka/topics";
import redisClient from "../config/redis";
import { IUser } from "../shared/types/IUser";
import { INotification } from "../shared/types/INotfication";
import logger from "../shared/utils/logger";

export class MessageService {
    private producer: KafkaProducer;
    constructor(private repo: ChatRepository) {
        this.producer = new KafkaProducer(kafka);
    }

    public async sendMessage(data: Message) {
        try {
            const message = await this.repo.sendMessage(data);
            const unreadKey = `unread:${data.receiver}:${data.sender}`;
            await redisClient.incr(unreadKey);
            await redisClient.expire(unreadKey, 24 * 60 * 60);
            const testNoti: INotification = {
                userId: message.receiver,
                title: "New Message",
                type: "message",
                message: "New message from a user"
            }
            redisClient.publish(`notifications:${testNoti.userId}`, JSON.stringify(testNoti));
            this.producer.sendData<Message>(TOPICS.NEW_MESSAGE, message);
            return {
                message: "Message sent",
                status: StatusCode.CREATED,
                chat: message
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async readMessage(userId: string, peerId: string) {
        try {
            if (!userId || !peerId) {
                return {
                    message: "User ID and peer ID required",
                    status: StatusCode.BAD_REQUEST
                }
            }

            await this.repo.markAsRead(userId, peerId);
            const unreadKey = `unread:${userId}:${peerId}`;
            await redisClient.set(unreadKey, 0);
            return {
                message: "Messages read",
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getInteractedChats(userId: string) {
        try {
            const ids = await this.repo.getInteractions(userId);
            if (ids.length === 0) {
                return {
                    message: "No Interactions found",
                    status: StatusCode.OK,
                    users: []
                }
            }

            const { data } = await axios.post(`${config.service.user}/bulk/users`, { ids });
            const users = data.users;

            const usersWithUnread = await Promise.all(
                users.map(async (user: IUser) => {
                    const key = `unread:${userId}:${user.id}`;
                    const count = await redisClient.get(key);

                    const lastMessage = await this.repo.getLastMessage(userId, user.id as string);
                    return {
                        ...user,
                        unreadCount: parseInt(count || "0", 10),
                        lastMessage: lastMessage?.content || null,
                        lastMessageAt: lastMessage?.createdAt || null
                    };
                })
            );

            return {
                message: "Interactions found",
                status: StatusCode.OK,
                users: usersWithUnread
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getMessages(peer1: string, peer2: string, limit: number, offset: number) {
        try {
            const messages = await this.repo.getMessage(peer1, peer2, limit, offset);
            return {
                message: "Fetched messages",
                status: StatusCode.OK,
                messages: messages.messages,
                total: messages.total
            }
        } catch (error) {
           logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}