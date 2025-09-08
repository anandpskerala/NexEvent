import { Kafka, Partitioners, Producer } from "kafkajs";
import { TOPICS } from "../topics";
import { injectable } from "tsyringe";
import { IKafkaProducer } from "./IKafkaProducer";

@injectable()
export class KafkaProducer implements IKafkaProducer {
    private _producer: Producer;
    constructor(private kafka: Kafka)  {
        this._producer = this.kafka.producer({createPartitioner: Partitioners.DefaultPartitioner});
    }

    public async connect(): Promise<void> {
        await this._producer.connect()
    }

    public async disconnect(): Promise<void> {
        await this._producer.disconnect();
    }

    public async sendData<T>(topic: TOPICS, data: T): Promise<void> {
        await this.connect();
        await this._producer.send({
            topic,
            messages: [{ value: JSON.stringify(data) }]
        });
        await this._producer.disconnect();
    }
}