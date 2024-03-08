import { PrismaClient } from "@prisma/client"

import { IProductCategory } from "../interfaces/IProductCategory"

class ProductCategoryModel {
    prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    /**
     * Creates a new product category in the database.
     * @param data - The data for the new product category.
     * @returns The created product category.
     * @throws An error if the product category could not be created.
     */
    async createProductCate({ name }: { name: string }) {
        try {
            const category = await this.prisma.productCategory.create({
                data: {
                    name,
                },
            })
            return category
        } catch (error) {
            let errorMsg = `Something went wrong when creating category ${name}`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async fetchCategory(categoryId: string) {
        try {
            const category = await this.prisma.productCategory.findUnique({
                where: {
                    id: categoryId,
                },
            })
            return category
        } catch (error) {
            let errorMsg = `Something went wrong when fetching category details`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async updateProductCate(cateId: string, data: Partial<IProductCategory>) {
        try {
            const category = await this.prisma.productCategory.update({
                where: {
                    id: cateId,
                },
                data: {
                    ...data,
                },
            })
            return category
        } catch (error) {
            let errorMsg = `Something went wrong when creating category ${name}`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async getAll() {
        try {
            const categorys = await this.prisma.productCategory.findMany()
            return categorys
        } catch (error) {
            let errorMsg = `Something went wrong when getting all categorys`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async deleteProductCategory(categoryId: string) {
        try {
            const category = await this.prisma.productCategory.delete({
                where: {
                    id: categoryId,
                },
            })
            return category
        } catch (error) {
            let errorMsg = `Something went wrong when deleting category`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }
}

export default ProductCategoryModel
