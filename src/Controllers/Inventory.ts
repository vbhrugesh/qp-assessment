import { Router } from "express"
import InventoryService from "../services/Inventory"

/**
 * @class ProductCategory
 * @classdesc This class contains all the routes for products
 */
export default class Inventory {
    /**
     * @description This is the base route for all the products routes
     */
    public path = "/inventory"

    /**
     * @description This is the express router for all the products routes
     */
    public router = Router()

    inventoryService = new InventoryService()
    constructor() {
        this.inventoryService = new InventoryService()
    }
}
