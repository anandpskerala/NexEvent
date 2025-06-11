import { Admin, Consumer } from "kafkajs";
import kafka from "..";
import { Handler } from "./handlers";
import { TOPICS } from "../topics";

export class KafkaConsumer {
    private consumer: Consumer;
    private admin: Admin;

    constructor(private handler: Handler) {
        this.consumer = kafka.consumer({ groupId: 'event-service-group' });
        this.admin = kafka.admin();
    }

    public async connect(): Promise<void> {
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
                {
                    topic: TOPICS.USER_CREATED,
                    numPartitions: 1,
                    replicationFactor: 1,
                },
                {
                    topic: TOPICS.USER_DELETED,
                    numPartitions: 1,
                    replicationFactor: 1,
                }
            ],
        });

        await this.admin.disconnect();
    }


    public async listen(): Promise<void> {
        await this.consumer.subscribe({ topic: TOPICS.USER_CREATED, fromBeginning: false });
        await this.consumer.subscribe({ topic: TOPICS.USER_DELETED, fromBeginning: false });


        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                const value = message.value?.toString();
                if (!value) return;

                const parsed = JSON.parse(value);

                switch (topic) {
                    case TOPICS.USER_CREATED:
                        await this.handler.handleNewUser(parsed);
                        break;
                        
                    case TOPICS.USER_DELETED:
                        await this.handler.handleDelete(parsed);
                        break;

                    default:
                        console.warn(`Unhandled topic: ${topic}`);
                }
            }
        });
    }
}