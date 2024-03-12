import { NextFunction, Request, Response, Router } from "express"
import HttpStatusCodes from "http-status-codes"

import HttpException from "../exceptions/HttpException"
import ProductModel from "../models/Product"
import ProductCategory from "../services/ProductCategory"
import { ResponseHandler } from "../utils/responseHandler"
import CategoryValidator from "../validators/CategoryValidators"

/**
 * @class ProductCategory
 * @classdesc This class contains all the routes for products
 */
export default class ProductCategoryController {
    /**
     * @description This is the base route for all the products routes
     */
    public path = "/products"

    /**
     * @description This is the express router for all the products routes
     */
    public router = Router()

    /**
     * @description This is an instance of the auth service
     */
    private productModel!: ProductModel

    /**
     * @description This is an instance of the auth service
     */
    private categoryService!: ProductCategory

    constructor() {
        this.productModel = new ProductModel()
        this.initializeRoutes()
    }

    /**
     * @description This method initializes all the routes for products
     */
    public initializeRoutes() {
        this.router.get(
            "/",
            CategoryValidator.validateCate,
            this.getProducts.bind(this)
        )
        this.router.get(
            "/:productId",
            CategoryValidator.validateCate,
            this.checkProductExists.bind(this),
            this.fetchProduct.bind(this)
        )
        this.router.post(
            "/",
            CategoryValidator.validateCate,
            this.checkProductExists.bind(this),
            this.create.bind(this)
        )
        this.router.put(
            "/:productId",
            CategoryValidator.validateCate,
            this.checkProductExists.bind(this),
            this.update.bind(this)
        )
        this.router.delete(
            "/:productId",
            CategoryValidator.validateCate,
            this.checkProductExists.bind(this),
            this.delete.bind(this)
        )
    }

    /**
     * @description This method is used to fetch the products
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await this.productModel.getAll()
            return ResponseHandler.success(
                res,
                { products },
                "Product product added successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description This method is used to create a new product product
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name,
                description,
                quantity,
                price,
                categoryId,
            }: {
                name: string
                description: string
                quantity: number
                price: number
                categoryId: string
            } = req.body
            const product = await this.productModel.createProduct({
                name,
                description,
                quantity,
                price,
                categoryId,
            })
            return ResponseHandler.success(
                res,
                { product },
                "Product product added successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description This method is used to fetch a product product details
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async fetchProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const product = res.locals.product
            return ResponseHandler.success(
                res,
                { product },
                "Product product details fetched successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description This method is used to update a product product
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name,
                description,
                quantity,
                price,
                categoryId,
            }: {
                name: string
                description: string
                quantity: number
                price: number
                categoryId: string
            } = req.body
            const productId = req.params.productId
            const product = await this.productModel.updateProduct(productId, {
                name,
                description,
                quantity,
                price,
                categoryId,
            })
            return ResponseHandler.success(
                res,
                { product },
                "Product product updated successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description This method is used to update a product product
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.productId
            await this.productModel.deleteProduct(productId)
            return ResponseHandler.success(
                res,
                {},
                "Product product deleted successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    private async checkProductExists(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const productId = req.params.productId
            if (!productId) {
                throw new HttpException(
                    HttpStatusCodes.UNPROCESSABLE_ENTITY,
                    "Please provide the product id"
                )
            }
            const product = await this.productModel.fetchProduct(productId)
            res.locals.product = product
            if (!product) {
                return ResponseHandler.error(
                    res,
                    "Product not found",
                    HttpStatusCodes.NOT_FOUND
                )
            }
            return next()
        } catch (error) {
            next(error)
        }
    }
}
