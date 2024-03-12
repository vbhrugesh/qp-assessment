import { Order } from "@prisma/client"

import { IOrderProduct } from "../interfaces/IOrder"
import OrderModel from "../models/Order"

export default class OrderService {
    private orderModel: OrderModel
    constructor() {
        this.orderModel = new OrderModel()
    }

    async getAll(userId: string) {
        try {
            const orders = await this.orderModel.getAll(userId)
            return orders
        } catch (error) {
            let errorMessage = `Something went wrong while fetching orders for user`
            if (error instanceof Error) {
                errorMessage = error.message
            }
            throw new Error(errorMessage)
        }
    }

    async createOrder({
        userId,
        orderItems,
    }: {
        userId: string
        orderItems: IOrderProduct[]
    }) {
        try {
            const totalPrice = await this.calculateTotalAmount(orderItems)
            const order = await this.orderModel.createOrder({
                userId,
                totalPrice,
                orderItems,
            })

            return order
        } catch (error) {
            let errorMsg = `Some error occurred while creating order`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async calculateTotalAmount(orderItems: IOrderProduct[]) {
        const totalAmount = orderItems.reduce(
            (total, item) => total + item.pricePerUnit * item.quantity,
            0
        )
        return totalAmount
    }

    async fetchOrder(orderId: string) {
        try {
            const order = await this.orderModel.fetchOrder(orderId)
            return order
        } catch (error) {
            let errorMsg = `Some error occurred while fetching order`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async updateOrder({
        order,
        orderItems,
    }: {
        order: Order
        orderItems: IOrderProduct[]
    }) {
        try {
            const totalAmount = await this.calculateTotalAmount(orderItems)

            const updatedOrder = await this.orderModel.updateOrder(order.id, {
                totalAmount,
            })
            return updatedOrder
        } catch (error) {
            let errorMsg = `Some error occurred while updating order`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async deleteOrder(orderId: string) {}
}
