import { Request, NextFunction, Response } from "express"
import HttpStatusCodes from "http-status-codes"

import HttpException from "../exceptions/HttpException"
import { ResponseHandler } from "../utils/responseHandler"

/**
 * Custom error handler for the app
 * @param error HttpException
 * @param req Request
 * @param res Request
 * @param _next NextFunction
 * @returns JSON error response
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const statusCode = error.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR
    const message = error.message || "Something went wrong"
    _next()
    return ResponseHandler.error(res, message, statusCode)
}
export default ErrorMiddleware
