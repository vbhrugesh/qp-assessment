import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import HttpStatusCodes from "http-status-codes"

import logger from "../utils/logger"

class CategoryValidator {
    public validateCate = [
        body("name").trim().notEmpty().withMessage("Name is required"),

        (req: Request, res: Response, next: NextFunction) => {
            this.handleValidationResult(req, res, next)
        },
    ]

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
