import { NextFunction, Request, Response, Router } from "express"
import HttpStatusCodes from "http-status-codes"

import HttpException from "../exceptions/HttpException"
import ProductCategoryModel from "../models/ProductCategory"
import ProductCategory from "../services/ProductCategory"
import { ResponseHandler } from "../utils/responseHandler"
import CategoryValidator from "../validators/CategoryValidators"

/**
 * @class ProductCategory
 * @classdesc This class contains all the routes for categories
 */
export default class ProductCategoryController {
    /**
     * @description This is the base route for all the categories routes
     */
    public path = "/categories"

    /**
     * @description This is the express router for all the categories routes
     */
    public router = Router()

    /**
     * @description This is an instance of the category model
     */
    private categoryModel!: ProductCategoryModel

    /**
     * @description This is an instance of the category model
     */
    private categoryService!: ProductCategory

    constructor() {
        this.categoryModel = new ProductCategoryModel()
        this.initializeRoutes()
    }

    /**
     * @description This method initializes all the routes for categories
     */
    public initializeRoutes() {
        this.router.get(
            "/",
            CategoryValidator.validateCate,
            this.getCategories.bind(this)
        )
        this.router.get(
            "/:categoryId",
            CategoryValidator.validateCate,
            CategoryValidator.fetchCategory,
            this.checkCategoryExists.bind(this),
            this.fetchCate.bind(this)
        )
        this.router.post(
            "/",
            CategoryValidator.validateCate,
            this.checkCategoryExists.bind(this),
            this.createCate.bind(this)
        )
        this.router.put(
            "/:categoryId",
            CategoryValidator.validateCate,
            this.checkCategoryExists.bind(this),
            this.updateCate.bind(this)
        )
        this.router.delete(
            "/:categoryId",
            CategoryValidator.validateCate,
            this.checkCategoryExists.bind(this),
            this.deleteCate.bind(this)
        )
    }

    /**
     * @description This method is used to fetch the categories
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async getCategories(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const categories = await this.categoryModel.getAll()
            return ResponseHandler.success(
                res,
                { categories },
                "Product category added successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description This method is used to create a new product category
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async createCate(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body
            const category = await this.categoryModel.createProductCate({
                name,
            })
            return ResponseHandler.success(
                res,
                { category },
                "Product category added successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description This method is used to fetch a product category details
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async fetchCate(req: Request, res: Response, next: NextFunction) {
        try {
            const category = res.locals.category
            return ResponseHandler.success(
                res,
                { category },
                "Product category details fetched successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description This method is used to update a product category
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async updateCate(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body
            const cateId = req.params.categoryId
            const category = await this.categoryModel.updateProductCate(
                cateId,
                {
                    name,
                }
            )
            return ResponseHandler.success(
                res,
                { category },
                "Product category updated successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description This method is used to update a product category
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async deleteCate(req: Request, res: Response, next: NextFunction) {
        try {
            const cateId = req.params.categoryId
            await this.categoryModel.deleteProductCategory(cateId)
            return ResponseHandler.success(
                res,
                {},
                "Product category deleted successfully"
            )
        } catch (error) {
            next(error)
        }
    }

    private async checkCategoryExists(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const cateId = req.params.categoryId
            if (!cateId) {
                throw new HttpException(
                    HttpStatusCodes.UNPROCESSABLE_ENTITY,
                    "Please provide the category id"
                )
            }
            const category =
                await this.categoryService.checkCategoryExists(cateId)
            res.locals.category = category
            if (!category) {
                return ResponseHandler.error(
                    res,
                    "Category not found",
                    HttpStatusCodes.NOT_FOUND
                )
            }
            return next()
        } catch (error) {
            next(error)
        }
    }
}
