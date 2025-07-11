import { Router } from "express";
import { UserProducer } from "../kafka/producer/userProducer";
import { UserRepository } from "../repositories/implementation/UserRepository";
import { UserService } from "../services/implementation/userService";
import { UserController } from "../controllers/userController";
import { protectedRoute } from "../middlewares/protectedRoute";
import { adminRoute } from "../middlewares/adminRoute";
import { UserDTO } from "../shared/dtos/userDTO";

const router = Router();

const producer = new UserProducer<UserDTO>();
const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService, producer);

router.post("/verify", userController.verifyUser);
router.get("/users", userController.getAllUsers);
router.post("/bulk/users", userController.getBulkUsers);
router.patch("/me/profile", protectedRoute, userController.updateProfile);
router.patch("/me/profile-image", protectedRoute, userController.updateProfileImage);
router.get("/:id", userController.getUser);
router.patch("/:id", adminRoute, userController.updateUser);
router.delete("/:id", adminRoute, userController.deleteUser);

export default router;
