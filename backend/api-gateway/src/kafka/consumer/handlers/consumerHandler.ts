import { Server } from "socket.io";
import { Message } from "../../../shared/types/Message";
import { INotification } from "../../../shared/types/INotification";

export class ConsumerHandler {
    constructor(private io: Server) {
    }

    async handleNewMessage(data: Message) {
        this.io.to(data.receiver).emit("new-message", data);
    }

    async handleNewNotification(data: INotification) {
        this.io.to(data.userId).emit("notification:new", data);
    }
}