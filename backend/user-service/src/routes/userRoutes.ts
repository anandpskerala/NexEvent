import { Router } from "express";
import { UserController } from "../controllers/userController";
import { protectedRoute } from "../middlewares/protectedRoute";
import { adminRoute } from "../middlewares/adminRoute";
import { container } from "../containers";

const router = Router();

const userController = container.resolve(UserController);

router.post("/verify", userController.verifyUser);
router.get("/users", userController.getAllUsers);
router.post("/bulk/users", userController.getBulkUsers);
router.patch("/me/profile", protectedRoute, userController.updateProfile);
router.patch("/me/profile-image", protectedRoute, userController.updateProfileImage);
router.get("/:id", userController.getUser);
router.patch("/:id", adminRoute, userController.updateUser);
router.delete("/:id", adminRoute, userController.deleteUser);

export default router;
