import { Admin, Consumer as KafkaConsumer } from "kafkajs";
import { ConsumerHandler } from "./handlers/consumerHandler";
import kafka from "..";
import { TOPICS } from "../topics";

export class Consumer {
    private consumer: KafkaConsumer;
    private admin: Admin;
    private shuttingDown = false;

    constructor(private handler: ConsumerHandler) {
        this.consumer = kafka.consumer({ groupId: 'message-service' });
        this.admin = kafka.admin();
    }

    public async connect(): Promise<void> {
        await this.createTopics();
        await this.consumer.connect();
        console.log("Kafka consumer connected");
    }

    public async disconnect(): Promise<void> {
        this.shuttingDown = true;
        try {
            await this.consumer.disconnect();
            console.log("Kafka consumer disconnected");
        } catch (error) {
            console.error("Error during Kafka disconnect:", error);
        }
    }

    private async createTopics(): Promise<void> {
        await this.admin.connect();

        try {
            await this.admin.createTopics({
                waitForLeaders: true,
                topics: [
                    { topic: TOPICS.NEW_NOTIFICATION, numPartitions: 1, replicationFactor: 1 },
                ],
            });
            console.log("Kafka topics ensured");
        } catch (err) {
                console.error("Failed to create Kafka topics:", err);
        } finally {
            await this.admin.disconnect();
        }
    }

    public async listen(): Promise<void> {
        await this.consumer.subscribe({ topic: TOPICS.NEW_NOTIFICATION, fromBeginning: false });

        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                if (this.shuttingDown) return;

                try {
                    const value = message.value?.toString();
                    if (!value) return;

                    const parsed = JSON.parse(value);

                    switch (topic) {
                        case TOPICS.NEW_NOTIFICATION:
                            await this.handler.handleNewNotification(parsed);
                            break;

                        default:
                            console.warn(`Unhandled Kafka topic: ${topic}`);
                    }
                } catch (error) {
                    console.error(`Error processing Kafka message on topic ${topic}:`, error);
                }
            }
        });

        console.log(`Kafka listening on topic: ${TOPICS.NEW_NOTIFICATION}`);
    }
}
