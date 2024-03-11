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
        this.router.get("/:orderId", this.fetchOrder.bind(this))
        this.router.put(
            "/:orderId",
            OrderValidator.validateCreateOrder,
            this.updateOrder.bind(this)
        )
        this.router.delete("/:orderId", this.deleteOrder.bind(this))
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await this.orderService.getAll()
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
            const {
                totalPrice,
                products,
            }: { totalPrice: number; products: IOrderProduct[] } = req.body
            if (!Array.isArray(products)) {
                throw new HttpException(
                    HttpStatusCodes.BAD_REQUEST,
                    "Invalid products"
                )
            }
            const order = await this.orderService.createOrder({
                userId: user?.id as string,
                totalPrice,
                products: products as IOrderProduct[],
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
            const order = await this.orderService.updateOrder(req.body)
            return ResponseHandler.success(
                res,
                { order },
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
}
