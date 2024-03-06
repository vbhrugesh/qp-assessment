import { PrismaClient, RoleEnumType } from "@prisma/client"
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

    async createUser(
        email: string,
        name: string,
        role: string,
        password: string
    ) {
        try {
            const hashedPassword = await this.hashPassword(password)
            const user = await this.prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    role: role as RoleEnumType,
                    password: hashedPassword,
                },
            })
            return user
        } catch (error) {
            let errorMsg = `Something went wrong when creating user ${name}`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async getAllUsers() {
        try {
            const users = await this.prisma.user.findMany()
            return users
        } catch (error) {
            let errorMsg = `Something went wrong when getting all users`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async comparePassword(email: string, password: string) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    email: email,
                },
            })
            if (!user) {
                return false
            }
            const isMatch = await compare(password, user.password)
            return isMatch
        } catch (error) {
            let errorMsg = `Something went wrong when comparing password`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }

    async hashPassword(password: string) {
        try {
            const salt = await genSalt(10)
            const hash = await hashSync(password, salt)
            return hash
        } catch (error) {
            let errorMsg = `Something went wrong when generating hash password`
            if (error instanceof Error) {
                errorMsg = error.message
            }
            throw new Error(errorMsg)
        }
    }
}

export default UserModel
