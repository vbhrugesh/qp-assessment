import { PrismaClient } from "@prisma/client"

class UserModel {
    prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    async createUser(email: string, name: string, role: string) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    role: role
                }
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
}

export default UserModel