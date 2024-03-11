import { PrismaClient } from "@prisma/client"

import { IProduct } from "../interfaces/IProduct"

class ProductModel {
    prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    /**
     * Creates a new product in the database.
     * @param data - The product data to create.
     * @returns The created product.
     * @throws An error if the product could not be created.
     */
    async createProduct({
        name,
        description,
        categoryId,
        price,
        quantity,
    }: {
        name: string
        description: string
        categoryId: string
        price: number
        quantity: number
    }) {
        try {
            const product = await this.prisma.product.create({
                data: {
                    name,
                    description,
                    categoryId,
                    price,
                    quantity,
                },
            })
            return product
        } catch (error) {
            let errorMsg = `Something went wrong when creating product ${name}`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    /**
     * Updates an existing product in the database.
     * @param productId - The ID of the product to update.
     * @param data - The updated product data.
     * @returns The updated product.
     * @throws An error if the product could not be updated.
     */
    async updateProduct(productId: string, data: Partial<IProduct>) {
        try {
            const product = await this.prisma.product.update({
                where: {
                    id: productId,
                },
                data: {
                    ...data,
                },
            })
            return product
        } catch (error) {
            let errorMsg = `Something went wrong when updating product ${productId}`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    /**
     * Retrieves all products from the database.
     *
     * @returns An array of products.
     * @throws An error if the products could not be retrieved.
     */
    async getAll(): Promise<IProduct[]> {
        try {
            const products = await this.prisma.product.findMany()
            return products
        } catch (error) {
            let errorMsg = `Something went wrong when getting all products`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    /**
     * Deletes a product from the database.
     * @param productId - The ID of the product to delete.
     * @returns The deleted product.
     * @throws An error if the product could not be deleted.
     */
    async deleteProduct(productId: string): Promise<IProduct> {
        try {
            const product = await this.prisma.product.delete({
                where: {
                    id: productId,
                },
            })
            return product
        } catch (error) {
            let errorMsg = `Something went wrong when deleting product`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    /**
     * Retrieves a product by its ID.
     * @param productId - The ID of the product to retrieve.
     * @returns The retrieved product, or null if the product could not be found.
     */
    async fetchProduct(productId: string): Promise<IProduct | null> {
        try {
            const product = await this.prisma.product.findUnique({
                where: {
                    id: productId,
                },
            })
            return product
        } catch (error) {
            let errorMsg = `Something went wrong when fetching product ${productId}`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }
}

export default ProductModel
