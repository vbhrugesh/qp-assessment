import InventoryModel from "../models/Inventory"
import ProductModel from "../models/Product"

export default class InventoryService {
    private inventoryModel: InventoryModel
    private productModel: ProductModel

    constructor(productModel?: ProductModel) {
        this.inventoryModel = new InventoryModel()
        this.productModel = productModel ? productModel : new InventoryModel()
    }

    async addStockForProduct(productId: string, quantity: number) {
        try {
            const product = await this.productModel.fetchProduct(productId)
            if (!product) {
                throw new Error("Product not found")
            }
            const stock = await this.inventoryModel.addStock(
                productId,
                quantity
            )
            return stock
        } catch (error) {
            let errorMessage = `Failed to add stock`
            if (error instanceof Error) {
                errorMessage = error.message
            }
            throw new Error(errorMessage)
        }
    }
}
