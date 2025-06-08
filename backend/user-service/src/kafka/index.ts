import { Kafka } from "kafkajs";
import { config } from "../config";


const kafka = new Kafka({
    clientId: "nexevent",
    brokers: [config.service.kafka || 'host.docker.internal:9092'],
    connectionTimeout: 5000,
    retry: {
        retries: 10,
        initialRetryTime: 3000,
    },
})


export default kafka;