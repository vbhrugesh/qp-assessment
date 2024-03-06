import { Response } from "express"
import HttpStatusCodes from "http-status-codes"

export class ResponseHandler {
    static success(
        res: Response,
        data: unknown,
        msg: string,
        statusCode = HttpStatusCodes.OK
    ) {
        res.status(statusCode).json({
            status: true,
            message: msg,
            data,
        })
    }

    static error(
        res: Response,
        message: string,
        statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
    ) {
        res.status(statusCode).json({
            status: false,
            error: {
                message,
            },
        })
    }
}
