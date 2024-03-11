import ProductCategoryModel from "../models/ProductCategory"

export default class ProductCategory {
    private productCategoryModel: ProductCategoryModel
    constructor() {
        this.productCategoryModel = new ProductCategoryModel()
    }

    async checkCategoryExists(categoryId: string) {
        try {
            const category =
                await this.productCategoryModel.fetchCategory(categoryId)
            return category
        } catch (error) {
            let errorMessage =
                "Something went wrong while checking category existence"
            if (error instanceof Error) {
                errorMessage = error.message
            }
            throw new Error(errorMessage)
        }
    }
}
