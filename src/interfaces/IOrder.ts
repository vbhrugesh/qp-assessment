import { Order } from "@prisma/client"

export interface ICreateOrder {
    products: IOrderProduct[]
}

export interface IOrder extends Order {}

export interface IOrderProduct {
    productId: string
    price: number
    quantity: number
}
