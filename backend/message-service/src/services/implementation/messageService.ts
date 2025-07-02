import axios from "axios";
import { StatusCode } from "../../shared/constants/statusCode";
import { config } from "../../config";
import { Message } from "../../shared/types/Message";
import { KafkaProducer } from "../../kafka/producer";
import kafka from "../../kafka";
import { TOPICS } from "../../kafka/topics";
import redisClient from "../../config/redis";
import { IUser } from "../../shared/types/IUser";
import { INotification } from "../../shared/types/INotfication";
import logger from "../../shared/utils/logger";
import { IChatRepository } from "../../repositories/interfaces/IChatRepository";
import { MessagePaginationType, MessageReturnType, UserReturnType } from "../../shared/types/ReturnTypes";
import { HttpResponse } from "../../shared/constants/httpResponse";

export class MessageService {
    private producer: KafkaProducer;
    constructor(private repo: IChatRepository) {
        this.producer = new KafkaProducer(kafka);
    }

    public async sendMessage(data: Message): Promise<MessageReturnType> {
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
                message: HttpResponse.MESSAGE_SENT,
                status: StatusCode.CREATED,
                chat: message
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async readMessage(userId: string, peerId: string): Promise<MessageReturnType> {
        try {
            if (!userId || !peerId) {
                return {
                    message: HttpResponse.USER_ID_REQUIRED,
                    status: StatusCode.BAD_REQUEST
                }
            }

            await this.repo.markAsRead(userId, peerId);
            const unreadKey = `unread:${userId}:${peerId}`;
            await redisClient.set(unreadKey, 0);
            return {
                message: HttpResponse.MESSAGE_READ,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getInteractedChats(userId: string): Promise<UserReturnType> {
        try {
            const ids = await this.repo.getInteractions(userId);
            if (ids.length === 0) {
                return {
                    message: HttpResponse.NO_INTERACTIONS,
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
                message: HttpResponse.INTERACTIONS_FOUND,
                status: StatusCode.OK,
                users: usersWithUnread
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getMessages(peer1: string, peer2: string, limit: number, offset: number): Promise<MessagePaginationType> {
        try {
            const messages = await this.repo.getMessage(peer1, peer2, limit, offset);
            return {
                message: HttpResponse.MESSAGES_FETCHED,
                status: StatusCode.OK,
                messages: messages.messages,
                total: messages.total
            }
        } catch (error) {
           logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}