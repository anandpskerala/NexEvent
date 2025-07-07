import redisClient from "../../config/redis";
import { broadcastToClient } from "./sseManager";

export const initRedisSubscriber = async () => {
  const subClient = redisClient.duplicate();
  await subClient.connect();

  await subClient.pSubscribe("notifications:*", (message, channel) => {
    const id = channel.split(":")[1];
    broadcastToClient(id, JSON.parse(message));
  });
};
