import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { CategoryController } from "../controllers/categoryController";
import { validate } from "../middlewares/validate";
import { createCategory } from "../shared/validators/categorySchema";
import { container } from "../containers";

const router = Router();

const categoryController = container.resolve(CategoryController);

router.post("/", protectedRoute, validate(createCategory), categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.patch("/:id", protectedRoute, validate(createCategory), categoryController.updateCategory);
router.delete("/:id", protectedRoute, categoryController.deleteCategory);


export default router;