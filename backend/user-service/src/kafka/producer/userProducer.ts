import kafka from "..";
import { Partitioners, Producer } from "kafkajs";
import { TOPICS } from "../topics";

export class UserProducer<T> {
    private producer: Producer;

    constructor() {
        this.producer = kafka.producer({createPartitioner: Partitioners.DefaultPartitioner});
    }

    async connect(): Promise<void> {
        await this.producer.connect();
    }

    async sendData(topic: TOPICS, message: T): Promise<void> {
        await this.producer.connect();
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }]
        });
        await this.producer.disconnect();
    }

    async disconnect(): Promise<void> {
        await this.producer.disconnect();
    }
}