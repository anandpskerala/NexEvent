import "reflect-metadata";
import { container } from "tsyringe";
import { registerRepositories } from "./repositories";
import { registerServices } from "./services";
import { registerControllers } from "./controllers";
import { UserProducer } from "../kafka/producer/userProducer";
import { UserDTO } from "../shared/dtos/userDTO";

registerRepositories();
registerServices();
registerControllers();

container.register<UserProducer<UserDTO>>("UserProducer", {
  useClass: UserProducer<UserDTO>,
});


export { container };