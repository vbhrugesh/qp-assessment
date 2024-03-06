import crypto from "crypto"

import { PrismaClient, UserToken } from "@prisma/client"
import { compare, genSalt, hashSync } from "bcryptjs"

class UserModel {
    prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    async findUser(userId?: string, email?: string, name?: string) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    id: userId,
                    email: email,
                    name: name,
                },
            })
            return user
        } catch (error) {
            let errorMsg = `Something went wrong when fetching user details`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async createUserToken(
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

    async findToken(token: string): Promise<UserToken | null> {
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
}

export default UserModel
