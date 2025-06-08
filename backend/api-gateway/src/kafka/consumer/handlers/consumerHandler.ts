import { Server } from "socket.io";
import { Message } from "../../../types/Message";

export class ConsumerHandler {
    constructor(private io: Server) {
    }

    async handleNewMessage(data: Message) {
        this.io.to(data.receiver).emit("new-message", data);
    }
}