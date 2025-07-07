import { Response } from "express";

type SSEClient = {
  id: string;
  res: Response;
};

type SSEMessage<T = unknown> = {
  event?: string;
  data: T;
};

const clients: SSEClient[] = [];


export const addClient = (id: string, res: Response): void => {
  clients.push({ id, res });
};


export const removeClient = (id: string): void => {
  const index = clients.findIndex((client) => client.id === id);
  if (index !== -1) {
    clients.splice(index, 1);
  }
};


export const broadcastToClient = <T>(id: string, message: SSEMessage<T>): void => {
  clients.forEach((client) => {
    if (client.id === id) {
      const formatted = message.event
        ? `event: ${message.event}\ndata: ${JSON.stringify(message.data)}\n\n`
        : `data: ${JSON.stringify(message.data)}\n\n`;

      client.res.write(formatted);
    }
  });
};

export const broadcastInit = <T>(id: string, unread: T): void => {
  broadcastToClient<T>(id, { event: "init", data: unread });
};
