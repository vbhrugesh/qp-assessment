import crypto from "crypto"

import { PrismaClient, UserToken } from "@prisma/client"

class UserTokenModel {
    private prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    /**
     * Creates a new user token.
     *
     * @param userId - The ID of the user to create the token for.
     * @param ipAddress - The IP address of the user creating the token.
     * @returns The newly created user token.
     */ async createUserToken(
        userId: string,
        ipAddress: string
    ): Promise<UserToken> {
        try {
            const userToken = await this.prisma.userToken.create({
                data: {
                    userId: userId,
                    token: crypto.randomBytes(40).toString("hex"),
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    createdByIp: ipAddress,
                },
            })
            return userToken
        } catch (error) {
            let errorMsg = `Something went wrong when creating user token`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    /**
     * Find a user token by its token.
     *
     * @param token - The token of the user token to find.
     * @returns The found user token, or null if no token was found.
     */
    async findToken(token: string) {
        try {
            const userToken = await this.prisma.userToken.findFirst({
                where: {
                    token: token,
                },
                include: {
                    user: true,
                },
            })
            return userToken
        } catch (error) {
            let errorMsg = `Something went wrong when fetching user token`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    /**
     * Deletes a user token by its ID.
     *
     * @param tokenId - The ID of the user token to delete.
     * @returns The deleted user token, or null if no token was found.
     */
    async deleteToken(tokenId: string): Promise<UserToken | null> {
        try {
            const userToken = await this.prisma.userToken.delete({
                where: {
                    id: tokenId,
                },
            })
            return userToken
        } catch (error) {
            let errorMsg = `Something went wrong when deleting user token`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    /**
     * Deletes all user tokens for a given user that have expired.
     *
     * @param userId - The ID of the user for which to delete expired tokens.
     * @returns The deleted user tokens.
     */
    async deleteMany(userId: string) {
        try {
            const userToken = await this.prisma.userToken.deleteMany({
                where: {
                    userId: userId,
                    expires: {
                        lt: new Date(),
                    },
                },
            })
            return userToken
        } catch (error) {
            let errorMsg = `Something went wrong when deleting user token`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    /**
     * Find a user token by its user ID.
     *
     * @param userId - The ID of the user for which to find the token.
     * @returns The found user token, or null if no token was found.
     */
    async findTokenByUser(userId: string) {
        try {
            const userToken = await this.prisma.userToken.findFirst({
                where: {
                    userId,
                },
                include: {
                    user: true,
                },
            })
            return userToken
        } catch (error) {
            let errorMsg = `Something went wrong when fetching user token`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }
}

export default UserTokenModel
