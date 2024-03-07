import { User } from "@prisma/client"
import { SignOptions } from "jsonwebtoken"

import UserModel from "../models/UserModel"
import UserTokenModel from "../models/UserToken"
import JwtHelper from "../utils/JwtHelper"

export default class Auth {
    private jwtHelper: JwtHelper
    private userTokenModel: UserTokenModel
    private userModel: UserModel
    /**
     * Creates a new instance of the AuthService class.
     */
    constructor() {
        this.jwtHelper = new JwtHelper()
        this.userTokenModel = new UserTokenModel()
        this.userModel = new UserModel()
    }

    /**
     * Used to generate JWT access token
     * @param user IUserModel
     * @returns
     */
    public createAccessToken = (user: User) => {
        const options = {
            expiresIn: process.env.ACCESS_TOKEN_LIFE || "1h",
            algorithm: "RS256",
        } as SignOptions

        return this.jwtHelper.sign(
            { sub: `${user.id}`, id: `${user.id}` },
            options
        )
    }

    /**
     * Used to generate the refresh token
     * @param user IUserModel
     * @param ipAddress string | undefined
     * @returns
     */
    public generateRefreshToken = async (
        user: User,
        ipAddress: string | undefined
    ) => {
        const userToken = await this.userTokenModel.createUserToken(
            user.id,
            ipAddress ? ipAddress : ""
        )
        return userToken
    }

    /**
     * Used to verify the refresh token
     * @param refreshToken string
     * @returns
     */
    public validateRefreshToken = async (refreshToken: string) => {
        const userToken = await this.userTokenModel.findToken(refreshToken)
        if (!userToken || userToken.expires < new Date()) {
            await this.userTokenModel.deleteMany(userToken?.userId as string)
            return null
        }
        return userToken.user
    }

    /**
     * Get the details of a refresh token by its associated user ID
     * @param userId - The ID of the user associated with the refresh token
     * @returns The details of the refresh token, including the IP address it was created from
     */
    public async getTokenDetailsByUserId(userId: string) {
        return this.userTokenModel.findTokenByUser(userId)
    }

    /**
     * @description This function is used to register a user.
     * @param email - The email address of the user.
     * @param password - The password of the user.
     * @param fullName - The first name of the user.
     * @param referralCode - The referral code of the user.
     * @param referredBy - The referrer of the user.
     * @param requestId - The request ID of the user.
     * @returns The registered user model.
     */
    public async registerUser({
        name,
        email,
        password,
    }: {
        name: string
        email: string
        password: string
    }): Promise<User> {
        try {
            const user = await this.userModel.createUser({
                email,
                name,
                role: "user",
                password,
            })

            return user
        } catch (error) {
            let errorMessage = "Error occurred when trying to register"
            if (error instanceof Error) {
                errorMessage = error.message
            }
            throw new Error(errorMessage)
        }
    }
}
