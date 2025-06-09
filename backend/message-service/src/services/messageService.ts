import axios from "axios";
import { StatusCode } from "../shared/constants/statusCode";
import { config } from "../config";
import { ChatRepository } from "../repositories/ChatRepository";
import { Message } from "../shared/types/Message";
import { KafkaProducer } from "../kafka/producer";
import kafka from "../kafka";
import { TOPICS } from "../kafka/topics";

export class MessageService {
    private producer: KafkaProducer;
    constructor(private repo: ChatRepository) {
        this.producer = new KafkaProducer(kafka);
     }

    public async sendMessage(data: Message) {
        try {
            const message = await this.repo.sendMessage(data);
            this.producer.sendData<Message>(TOPICS.NEW_MESSAGE, message);
            return {
                message: "Message sent",
                status: StatusCode.CREATED,
                chat: message
            }
        } catch (error) {
            console.log(error);
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

            const { data: users } = await axios.post(`${config.service.user}/bulk/users`, {
                ids
            });

            return {
                message: "Interactions found",
                status: StatusCode.OK,
                users
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getMessages(peer1: string, peer2: string) {
        try {
            const messages = await this.repo.getMessage(peer1, peer2);
            return {
                message: "Fetched messages",
                status: StatusCode.OK,
                messages
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}