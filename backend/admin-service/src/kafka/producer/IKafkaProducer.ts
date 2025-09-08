import { TOPICS } from "../topics";

export interface IKafkaProducer {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendData<T>(topic: TOPICS, data: T): Promise<void>;
}