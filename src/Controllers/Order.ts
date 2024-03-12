import { Request, Response, NextFunction, Router } from "express"
import HttpStatusCodes from "http-status-codes"

import HttpException from "../exceptions/HttpException"
import { IOrderProduct } from "../interfaces/IOrder"
import OrderService from "../services/Order"
import { ResponseHandler } from "../utils/responseHandler"
import OrderValidator from "../validators/OrderValidator"

/**
 * @class Order
 * @classdesc This class contains all the routes for Order management
 */
export default class Order {
    /**
     * @description This is the base route for all the authentication routes
     */
    public path = "/orders"

    /**
     * @description This is the express router for all the authentication routes
     */
    public router = Router()

    /**
     * @description This is an instance of the order service
     */
    private orderService: OrderService

    constructor() {
        this.orderService = new OrderService()
        this.initializeRoutes()
    }

    /**
     * @description This method initializes all the routes for authentication
     */
    public initializeRoutes() {
        this.router.get("/", this.getAll.bind(this))
        this.router.post(
            "/",
            OrderValidator.validateCreateOrder,
            this.createOrder.bind(this)
        )
        this.router.get(
            "/:orderId",
            this.checkOrderExists.bind(this),
            this.fetchOrder.bind(this)
        )
        this.router.put(
            "/:orderId",
            OrderValidator.validateCreateOrder,
            this.checkOrderExists.bind(this),
            this.updateOrder.bind(this)
        )
        this.router.delete(
            "/:orderId",
            this.checkOrderExists.bind(this),
            this.deleteOrder.bind(this)
        )
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await this.orderService.getAll(
                req.user?.id as string
            )
            return ResponseHandler.success(
                res,
                { orders },
                "Orders fetched successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * Creates a new order.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function in the stack.
     */
    async createOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user = req.user
            const { products }: { products: IOrderProduct[] } = req.body
            if (!Array.isArray(products)) {
                throw new HttpException(
                    HttpStatusCodes.BAD_REQUEST,
                    "Invalid products"
                )
            }
            const order = await this.orderService.createOrder({
                userId: user?.id as string,
                orderItems: products as IOrderProduct[],
            })
            return ResponseHandler.success(
                res,
                { order },
                "Order created successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    async updateOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string
            const order = res.locals.order as Order
            const { products }: { products: IOrderProduct[] } = req.body
            if (!Array.isArray(products)) {
                throw new HttpException(
                    HttpStatusCodes.BAD_REQUEST,
                    "Invalid products"
                )
            }
            const updatedOrder = await this.orderService.updateOrder({
                order: order as Order,
                products: products as IOrderProduct[],
            })
            return ResponseHandler.success(
                res,
                { order: updatedOrder },
                "Order updated successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    async fetchOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await this.orderService.fetchOrder(req.params.orderId)
            return ResponseHandler.success(
                res,
                { order },
                "Order fetched successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    async deleteOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = req.params.orderId
            await this.orderService.deleteOrder(orderId)
            return ResponseHandler.success(
                res,
                {},
                "Order deleted successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    async checkOrderExists(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string
            const orderId = req.params.orderId
            if (!orderId) {
                throw new HttpException(
                    HttpStatusCodes.UNPROCESSABLE_ENTITY,
                    "Please provide the order id"
                )
            }
            const order = await this.orderService.fetchOrder(orderId)
            if (!order) {
                throw new HttpException(
                    HttpStatusCodes.NOT_FOUND,
                    "Order details not found"
                )
            }

            if (order.userId !== userId) {
                throw new HttpException(
                    HttpStatusCodes.UNAUTHORIZED,
                    "You are not authorized to access this resource"
                )
            }
            res.locals.order = order
            return next()
        } catch (error) {
            next(error)
        }
    }
}
