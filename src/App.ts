import { PrismaClient } from "@prisma/client"
import cors from "cors"
import express, { Application } from "express"
import HttpStatusCodes from "http-status-codes"
import morgan from "morgan"
import passport from "passport"

import HttpException from "./exceptions/HttpException"
import Controller from "./interfaces/IController"
import ErrorMiddleware from "./middlewares/ErrorMiddleware"
import logger from "./utils/logger"

/**
 * App - Main application class
 */
class App {
    public expess: Application
    public port: number
    public prisma: PrismaClient

    constructor(controllers: Controller[], port: number) {
        this.expess = express()
        this.port = port
        // THE ORDER OF THESE FUNCTIONS IS IMPORTANT
        this.prisma = new PrismaClient()
        this.initializeMiddleware()
        this.initializeMainRoute()
        this.initializeControllers(controllers)
        this.initializeLogger()
        this.initializeErrorHandling()
    }

    /**
     * Configures the middleware for the Express application.
     */
    private initializeMiddleware(): void {
        /**
         * Enables cross-origin resource sharing (CORS) for the Express application.
         */
        this.expess.use(cors())

        /**
         * Enables parsing of JSON requests sent to the Express application.
         */
        this.expess.use((req, res, next) => {
            if (req.originalUrl.includes("stripe-webhooks")) {
                next()
            } else {
                express.json()(req, res, next)
            }
        })

        /**
         * Enables parsing of URL-encoded requests sent to the Express application.
         */
        this.expess.use(express.urlencoded({ extended: true }))

        this.expess.use(passport.initialize())

        /**
         * Logs the incoming request to the Express application.
         * @param req The incoming request.
         * @param res The outgoing response.
         * @param next The next middleware function.
         */
        this.expess.use((req, res, next) => {
            /**
             * Logs the incoming request.
             */
            logger.info(
                `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
            )

            /**
             * Logs the outgoing response.
             */
            res.on("finish", () => {
                logger.info(
                    `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
                )
            })

            next()
        })
    }

    /**
     * Configures the main route for the Express application.
     */
    private initializeMainRoute(): void {
        this.expess.get("/", (req, res) => {
            /**
             * Returns a JSON response with a welcome message.
             * @param req The incoming request.
             * @param res The outgoing response.
             */
            res.json({ message: "Welcome to Grocery shop backend application" })
        })
    }

    /**
     * Configures the controllers for the Express application.
     * @param controllers - The controllers to be registered.
     */
    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.expess.use(`/api${controller.path}`, controller.router)
        })
    }

    /**
     * Configures the error handling for the Express application.
     */
    private initializeErrorHandling(): void {
        /**
         * Error handling middleware.
         * @param req The incoming request.
         * @param res The outgoing response.
         * @param next The next middleware function.
         */
        this.expess.use((req, res, next) => {
            /**
             * Creates a new HttpException with the specified status code and message.
             * @param statusCode The status code of the HTTP response.
             * @param message The message to be sent in the response body.
             */
            next(new HttpException(HttpStatusCodes.BAD_REQUEST, "Not Found"))
        })

        /**
         * Error handling middleware.
         * @param err The error object.
         * @param req The incoming request.
         * @param res The outgoing response.
         * @param next The next middleware function.
         */
        this.expess.use(ErrorMiddleware)
    }

    /**
     * Configures the logger for the Express application.
     */
    private initializeLogger(): void {
        this.expess.use(
            morgan("combined", {
                stream: { write: (message) => logger.info(message.trim()) },
            })
        )
    }

    /**
     * Starts the server and listens on the specified port.
     */
    public listen(): void {
        this.expess.listen(this.port, () => {
            /**
             * Logs a message indicating that the server is listening on the specified port.
             */
            logger.info(`App listening on port ${this.port}`)
        })
    }
}

export default App
