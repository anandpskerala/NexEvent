import { ProducerRecord } from "kafkajs";
import logger from "../../shared/utils/logger";
import kafka from "..";

const producer = kafka.producer();

export const sendToDLQ = async <T>(topic: string, payload: T, reason?: string) => {
    try {
        await producer.connect();

        const message: ProducerRecord = {
            topic,
            messages: [
                {
                    value: JSON.stringify(payload),
                    headers: {
                        "x-error-reason": Buffer.from(reason || "unknown"),
                        "x-timestamp": Buffer.from(new Date().toISOString())
                    }
                }
            ]
        };

        await producer.send(message);
        await producer.disconnect();
    } catch (err) {
        logger.error("Failed to send to DLQ:", err);
    }
};