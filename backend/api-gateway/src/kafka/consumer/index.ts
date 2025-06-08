import { Admin, Consumer as KafkaConsumer } from "kafkajs";
import { ConsumerHandler } from "./handlers/consumerHandler";
import kafka from "..";
import { TOPICS } from "../topics";

export class Consumer {
    private consumer: KafkaConsumer;
    private admin: Admin;

    constructor(private handler: ConsumerHandler) {
        this.consumer = kafka.consumer({ groupId: 'gateway-service' });
        this.admin = kafka.admin();
    }

    public async connect(): Promise<void> {
        await this.createTopics();
        await this.consumer.connect();
    }

    public async disconnect(): Promise<void> {
        await this.consumer.disconnect();
    }

    public async createTopics(): Promise<void> {
        await this.admin.connect();

        await this.admin.createTopics({
            waitForLeaders: true,
            topics: [
                { topic: TOPICS.STOCK_UPDATED, numPartitions: 1, replicationFactor: 1 },
                { topic: TOPICS.NEW_MESSAGE, numPartitions: 1, replicationFactor: 1 }
            ]
        });

        await this.admin.disconnect();
    }


    public async listen(): Promise<void> {
        await this.consumer.subscribe({ topic: TOPICS.STOCK_UPDATED, fromBeginning: false });
        await this.consumer.subscribe({ topic: TOPICS.NEW_MESSAGE, fromBeginning: false });

        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                const value = message.value?.toString();
                if (!value) return;

                const parsed = JSON.parse(value);

                switch (topic) {
                    case TOPICS.STOCK_UPDATED:
                        console.log(parsed);
                        // await this.userHandler.handleUserUpdated(parsed);
                        break;
                    
                    case TOPICS.NEW_MESSAGE:
                        await this.handler.handleNewMessage(parsed);
                        break;

                    default:
                        console.warn(`Unhandled topic: ${topic}`);
                }
            }
        });
    }
}