import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { CategoryController } from "../controllers/categoryController";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CategoryService } from "../services/categoryService";

const router = Router();

const categoryRepo = new CategoryRepository();
const categoryService = new CategoryService(categoryRepo);
const categoryController = new CategoryController(categoryService);

router.post("/", protectedRoute, categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.patch("/:id", protectedRoute, categoryController.updateCategory);
router.delete("/:id", protectedRoute, categoryController.deleteCategory);


export default router;