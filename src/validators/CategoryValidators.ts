import { NextFunction, Request, Response } from "express"
import { body, validationResult, param } from "express-validator"
import HttpStatusCodes from "http-status-codes"

import ProductCategory from "../services/ProductCategory"
import logger from "../utils/logger"

class CategoryValidator {
    constructor() {
        this.categoryModel = new ProductCategory()
    }
    public fetchCategory = [
        param("categoryId")
            .trim()
            .notEmpty()
            .withMessage("Category id is required")
            .custom(async (categoryId) => {
                console.log("here".repeat(10))
                const category =
                    await this.categoryModel.checkCategoryExists(categoryId)
                return category
            }),
    ]
    public validateCate = [
        body("name").trim().notEmpty().withMessage("Name is required"),

        (req: Request, res: Response, next: NextFunction) => {
            this.handleValidationResult(req, res, next)
        },
    ]
    private categoryModel: ProductCategory

    public handleValidationResult(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({
                    status: false,
                    errors: error.array(),
                })
            }
            next()
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
}

export default new CategoryValidator()
