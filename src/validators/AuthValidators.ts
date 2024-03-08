import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import HttpStatusCodes from "http-status-codes"

import logger from "../utils/logger"

class AuthValidator {
    public validateSignUp = [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid Email Address"),
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Please provide valid password")
            .isLength({ min: 8, max: 255 })
            .withMessage("Password must be between 8 and 255 characters")
            .matches(/[\W_]/)
            .withMessage(
                "Password must contain at least one special character"
            ),
        body("password_confirm")
            .trim()
            .notEmpty()
            .withMessage("Please confirm the Password")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("The passwords do not match"),

        (req: Request, res: Response, next: NextFunction) => {
            this.handleValidationResult(req, res, next)
        },
    ]

    public validateLogin = [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid Email Address"),

        body("password").trim().notEmpty().withMessage("Password is required"),

        (req: Request, res: Response, next: NextFunction) => {
            this.handleValidationResult(req, res, next)
        },
    ]

    public validateVerifyEmail = [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid Email Address"),

        body("otp").trim().notEmpty().withMessage("OTP is required"),

        (req: Request, res: Response, next: NextFunction) => {
            this.handleValidationResult(req, res, next)
        },
    ]

    public validateForgotPassword = [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid Email Address"),

        (req: Request, res: Response, next: NextFunction) => {
            this.handleValidationResult(req, res, next)
        },
    ]

    public validateNotification = [
        body("isAllow")
            .trim()
            .notEmpty()
            .withMessage("Notification permission is required"),

        (req: Request, res: Response, next: NextFunction) => {
            this.handleValidationResult(req, res, next)
        },
    ]

    public validateChangePassword = [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid Email Address"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Please provide valid password")
            .isLength({ min: 8, max: 255 })
            .withMessage("Password must be between 8 and 255 characters")
            .matches(/[\W_]/)
            .withMessage(
                "Password must contain at least one special character"
            ),
        body("password_confirm")
            .trim()
            .notEmpty()
            .withMessage("Please confirm the Password")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("The passwords do not match"),

        (req: Request, res: Response, next: NextFunction) => {
            this.handleValidationResult(req, res, next)
        },
    ]

    public validateResendOtp = [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid Email Address"),
        body("typeOfOtp").trim().notEmpty().withMessage("OTP Type is required"),

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

export default new AuthValidator()
