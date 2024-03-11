import { IOrderProduct } from "../interfaces/IOrder"
import OrderModel from "../models/Order"

export default class OrderService {
    private orderModel: OrderModel
    constructor() {
        this.orderModel = new OrderModel()
    }

    async createOrder({
        userId,
        totalPrice
        products,
    }: {
        userId: string,
        totalPrice: number
        products: IOrderProduct[]
    }) {
        try {
            const orderItems = this.generateOrderItems(products)
            const order = await this.orderModel.createOrder({
                userId,
                totalPrice,
                orderItems
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

    private generateOrderItems(products: IOrderProduct[]) {
        const orderItems = products.map(product => {
            return {
                productId: product.productId,
                quantity: product.quantity,
                pricePerUnit: product.price
            }
        })
        return orderItems
    }

    async fetchOrder(orderId: string) {}

    async updateOrder(
        orderId: string,
        { userId, products }: { userId: string; products: IOrderProduct }
    ) {}

    async deleteOrder(orderId: string) {}
}
