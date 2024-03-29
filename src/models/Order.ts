import { OrderItem, PrismaClient } from "@prisma/client"

import { IOrder, IOrderProduct } from "../interfaces/IOrder"
import { IOrderItem } from "../interfaces/IOrderItem"

class OrderModel {
    prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    async createOrder({
        userId,
        totalPrice,
        orderItems,
    }: {
        userId: string
        totalPrice: number
        orderItems: IOrderProduct[]
    }) {
        try {
            const order = await this.prisma.order.create({
                data: {
                    userId,
                    totalAmount: totalPrice,
                    orderDate: new Date(),
                    orderItems: {
                        create: orderItems.map((item) => {
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                pricePerUnit: item.pricePerUnit,
                            }
                        }),
                    },
                },
            })
            return order
        } catch (error) {
            let errorMsg = `Something went wrong when creating order ${name}`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async updateOrder(productId: string, data: Partial<IOrder>) {
        try {
            const order = await this.prisma.order.update({
                where: {
                    id: productId,
                },
                data: {
                    ...data,
                },
            })
            return order
        } catch (error) {
            let errorMsg = `Something went wrong when creating order ${name}`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async getAll(userId: string) {
        try {
            const products = await this.prisma.order.findMany({
                where: {
                    userId,
                },
                include: {
                    orderItems: true,
                },
            })
            return products
        } catch (error) {
            let errorMsg = `Something went wrong when getting all products`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async deleteOrder(productId: string) {
        try {
            const order = await this.prisma.order.delete({
                where: {
                    id: productId,
                },
            })
            return order
        } catch (error) {
            let errorMsg = `Something went wrong when deleting order`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async fetchOrder(orderId: string) {
        try {
            const order = await this.prisma.order.findUnique({
                where: {
                    id: orderId,
                },
            })
            return order
        } catch (error) {
            let errorMsg = `Something went wrong when fetching order`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }
}

export default OrderModel
