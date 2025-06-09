import { Request, Response } from "express";
import { MessageService } from "../services/messageService";

export class MessageController {
    constructor(private message: MessageService) {};

    public sendMessage = async (req: Request, res: Response): Promise<void> => {
        const { sender, receiver, content, media } = req.body;
        const result = await this.message.sendMessage({sender, receiver, content, media});
        res.status(result.status).json({message: result.message, chat: result.chat});
    }

    public getInteractions = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const result = await this.message.getInteractedChats(userId);
        res.status(result.status).json({message: result.message, users: result.users});
    }

    public getMessages = async (req: Request, res: Response): Promise<void> => {
        const peer1 = req.headers['x-user-id'] as string;
        const { id } = req.params;
        const result = await this.message.getMessages(peer1, id as string);
        res.status(result.status).json({message: result.message, messages: result.messages});
    }
}