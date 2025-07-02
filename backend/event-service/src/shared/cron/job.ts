import cron from "node-cron";
import { EventRepository } from "../../repositories/implementation/EventRepository";

const eventRepo = new EventRepository();

cron.schedule("0 0 * * *", async () => {
  await eventRepo.updateEnded();
});