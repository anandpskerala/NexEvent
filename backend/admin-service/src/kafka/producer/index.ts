import { Kafka, Partitioners, Producer } from "kafkajs";
import { TOPICS } from "../topics";

export class KafkaProducer {
    private producer: Producer;
    constructor(private kafka: Kafka)  {
        this.producer = this.kafka.producer({createPartitioner: Partitioners.DefaultPartitioner});
    }

    public async connect(): Promise<void> {
        await this.producer.connect()
    }

    public async disconnect(): Promise<void> {
        await this.producer.disconnect();
    }

    public async sendData<T>(topic: TOPICS, data: T): Promise<void> {
        await this.connect();
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(data) }]
        });
        await this.producer.disconnect();
    }
}