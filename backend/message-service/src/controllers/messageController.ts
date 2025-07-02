import { Request, Response } from "express";
import { IMessageService } from "../services/interfaces/IMessageService";

export class MessageController {
    constructor(private message: IMessageService) {};

    public sendMessage = async (req: Request, res: Response): Promise<void> => {
        const { sender, receiver, content, media } = req.body;
        const result = await this.message.sendMessage({sender, receiver, content, media});
        res.status(result.status).json({message: result.message, chat: result.chat});
    }

    public markAsRead = async (req: Request, res: Response): Promise<void> => {
        const peer1 = req.headers['x-user-id'] as string;
        const { id } = req.params;
        const result = await this.message.readMessage(peer1, id);
        res.status(result.status).json({message: result.message});
    }

    public getInteractions = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const result = await this.message.getInteractedChats(userId);
        res.status(result.status).json({message: result.message, users: result.users});
    }

    public getMessages = async (req: Request, res: Response): Promise<void> => {
        const peer1 = req.headers['x-user-id'] as string;
        const { id } = req.params;
        const { limit = 20, offset = 0 } = req.query;
        const result = await this.message.getMessages(peer1, id as string, Number(limit), Number(offset));
        res.status(result.status).json({message: result.message, messages: result.messages});
    }
}