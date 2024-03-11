import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import HttpStatusCodes from "http-status-codes"

import logger from "../utils/logger"

class OrderValidator {
    public validateCreateOrder = [
        body("totalPrice")
            .isNumeric()
            .withMessage("Total Price must be a number"),
        body("products").isArray().withMessage(`Products must be an array`),
        body("products.*")
            .isObject()
            .withMessage(`Each element must be an object`),
        body("products.*.id")
            .isString()
            .withMessage(`Product ID must be a string`),
        body("products.*.quantity")
            .isInt()
            .withMessage(`Product quantity must be a number`),
        body("products.*.price")
            .isNumeric()
            .withMessage(`Product price must be a number`),

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

export default new OrderValidator()
