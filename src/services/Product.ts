import ProductModel from "../models/Product"
import ProductCategoryModel from "../models/ProductCategory"

export default class ProductService {
    private productModel: ProductModel
    private productCategoryModel: ProductCategoryModel
    constructor() {
        this.productModel = new ProductModel()
        this.productCategoryModel = new ProductCategoryModel()
    }

    async createProductWithInventory({
        name,
        categoryId,
        description,
        price,
        quantity,
    }: {
        name: string
        categoryId: string
        description: string
        price: number
        quantity: number
    }) {
        try {
            const category =
                await this.productCategoryModel.fetchCategory(categoryId)
            if (!category) {
                throw new Error("Product Category not found")
            }
            const product = await this.productModel.createProduct({
                name,
                description,
                categoryId,
                price,
                quantity,
            })
            return product
        } catch (error) {
            let errorMessage = `Something went wrong while creating product`
            if (error instanceof Error) {
                errorMessage = error.message
            }
            throw new Error(errorMessage)
        }
    }
}
