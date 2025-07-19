import "reflect-metadata";
import { container } from "tsyringe";
import { registerRepositories } from "./repositories";
import { registerServices } from "./services";
import { registerControllers } from "./controllers";

registerRepositories();
registerServices();
registerControllers();

export { container };