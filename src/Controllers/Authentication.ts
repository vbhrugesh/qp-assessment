import { User } from "@prisma/client"
import { NextFunction, Request, Response, Router } from "express"
import HttpStatusCodes from "http-status-codes"
import passport from "passport"
import { IVerifyOptions } from "passport-local"

import HttpException from "../exceptions/HttpException"
import "../utils/passport"
import verifyToken from "../middlewares/AuthMiddleware"
import UserModel from "../models/UserModel"
import UserTokenModel from "../models/UserToken"
import Auth from "../services/Auth"
import { ResponseHandler } from "../utils/responseHandler"
import AuthValidator from "../validators/AuthValidators"

/**
 * @class Authentication
 * @classdesc This class contains all the routes for authentication
 */
export default class Authentication {
    /**
     * @description This is the base route for all the authentication routes
     */
    public path = "/auth"

    /**
     * @description This is the express router for all the authentication routes
     */
    public router = Router()

    /**
     * @description This is an instance of the auth service
     */
    private userModel!: UserModel

    /**
     * @description This is an instance of the auth service
     */
    private userTokenModel!: UserTokenModel

    /**
     * @description This is an instance of the auth service
     */
    private authService!: Auth

    constructor() {
        this.userModel = new UserModel()
        this.userTokenModel = new UserTokenModel()
        this.authService = new Auth()
        this.initializeRoutes()
    }

    /**
     * @description This method initializes all the routes for authentication
     */
    public initializeRoutes() {
        this.router.post(
            "/login",
            AuthValidator.validateLogin,
            this.login.bind(this)
        )
        this.router.post(
            "/register",
            AuthValidator.validateSignUp,
            this.register.bind(this)
        )

        this.router.post("/logout", verifyToken, this.logout.bind(this))
        this.router.post("/refresh-token", this.validateRefreshToken.bind(this))
    }

    /**
     * @description This method is used to log in a user to the system
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async login(req: Request, res: Response, next: NextFunction) {
        passport.authenticate(
            "user-local",
            async (err: Error, user: Express.User, info: IVerifyOptions) => {
                try {
                    if (err) {
                        throw new HttpException(
                            HttpStatusCodes.BAD_REQUEST,
                            err.message
                        )
                    }

                    if (!user) {
                        throw new HttpException(
                            HttpStatusCodes.UNAUTHORIZED,
                            "User does not exist " + info.message
                        )
                    }

                    const tokens =
                        await this.generateAccessTokenAndRefreshToken(
                            user,
                            req.ip
                        )
                    const userObj = {
                        user,
                        ...tokens,
                    }
                    if (!req.user && user) {
                        req.user = user
                    }
                    return ResponseHandler.success(
                        res,
                        userObj || {},
                        "Login Successful!",
                        HttpStatusCodes.OK
                    )
                } catch (error) {
                    next(error) // Pass the error to the next middleware for centralized error handling
                }
            }
        )(req, res, next)
    }

    /**
     * @description This method is used to register a user to the system
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async register(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                email,
                password,
                name,
            }: {
                email: string
                password: string
                name: string
            } = req.body

            const checkEmail = await this.userModel.findUserByEmail(email)
            if (checkEmail) {
                throw new HttpException(
                    HttpStatusCodes.BAD_REQUEST,
                    `Email already exists`
                )
            }

            const user = await this.authService.registerUser({
                email,
                password,
                name,
            })

            return ResponseHandler.success(
                res,
                { user },
                "Registration successful, Please verify your email",
                HttpStatusCodes.OK
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description This method is used to generate access token and refresh token
     * @param {User | Express.User} user - The user object
     * @param {string} ipAddress - The IP address of the user
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     */
    public async generateAccessTokenAndRefreshToken(
        user: User | Express.User,
        ipAddress: string | undefined
    ) {
        try {
            // Create Access Token
            const accessToken = this.authService.createAccessToken(<User>user)
            const newRefreshToken = await this.authService.generateRefreshToken(
                <User>user,
                ipAddress
            )

            return { accessToken, refreshToken: newRefreshToken.token }
        } catch (error) {
            throw new Error("Error generating access token and refresh token")
        }
    }

    /**
     * @description This method is used to logout the user from the system and remove all its tokens
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user
            if (!user) {
                throw new HttpException(HttpStatusCodes.OK, "User not found")
            }
            await this.removeAllTokens(<User>user)
            return ResponseHandler.success(
                res,
                {},
                "Logout Successfully",
                HttpStatusCodes.OK
            )
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    /**
     * @description This method is used to generate new token for the user from refreshToken
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next function
     * @returns {Promise<void>}
     */
    public async validateRefreshToken(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { token } = req.body

            if (!token) {
                throw new HttpException(
                    HttpStatusCodes.BAD_REQUEST,
                    "Refresh token is required"
                )
            }
            const user = await this.authService.validateRefreshToken(token)

            if (!user) {
                throw new HttpException(
                    HttpStatusCodes.UNAUTHORIZED,
                    "Invalid refresh token"
                )
            }

            // Generate a new access token
            const tokens = await this.generateAccessTokenAndRefreshToken(
                user,
                req.ip
            )

            // Send the new access token to the client
            return ResponseHandler.success(
                res,
                tokens,
                "Tokens generated successfully",
                HttpStatusCodes.OK
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description This method is used to remove all the tokens from the DB
     * @param {IUserModel} user - The user object
     * @returns {Promise<void>}
     */
    public async removeAllTokens(user: User) {
        await this.userTokenModel.deleteMany(user.id)
    }
}
