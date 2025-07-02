import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { CategoryController } from "../controllers/categoryController";
import { CategoryRepository } from "../repositories/implementation/CategoryRepository";
import { CategoryService } from "../services/implementation/categoryService";
import { validate } from "../middlewares/validate";
import { createCategory } from "../shared/validators/categorySchema";

const router = Router();

const categoryRepo = new CategoryRepository();
const categoryService = new CategoryService(categoryRepo);
const categoryController = new CategoryController(categoryService);

router.post("/", protectedRoute, validate(createCategory), categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.patch("/:id", protectedRoute, validate(createCategory), categoryController.updateCategory);
router.delete("/:id", protectedRoute, categoryController.deleteCategory);


export default router;