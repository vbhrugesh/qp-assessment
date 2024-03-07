import { PrismaClient, RoleEnumType, User } from "@prisma/client"
import { compare, genSalt, hashSync } from "bcryptjs"

class UserModel {
    private prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    /**
     * Fetches a user from the database based on the given user ID.
     * @param userId - The ID of the user to fetch. If not provided, returns the details of the currently authenticated user.
     * @returns The user details, or null if no user was found.
     */ async findUser(userId?: string): Promise<User | null> {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    id: userId,
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

    /**
     * Fetches a user from the database based on the given user ID.
     * @param userId - The ID of the user to fetch. If not provided, returns the details of the currently authenticated user.
     * @returns The user details, or null if no user was found.
     */ async findUserByEmail(email: string) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    email: email,
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

    /**
     * Creates a new user in the database.
     * @param email - The email address of the user.
     * @param name - The name of the user.
     * @param role - The role of the user.
     * @param password - The password of the user.
     * @returns The newly created user.
     */
    async createUser({
        email,
        name,
        role,
        password,
    }: {
        email: string
        name: string
        role: string
        password: string
    }) {
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

    /**
     * Fetches a user from the database based on the given user ID.
     * @param userId - The ID of the user to fetch. If not provided, returns the details of the currently authenticated user.
     * @returns The user details, or null if no user was found.
     */
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

    /**
     * Compares the given password with the stored password for the user with the given email.
     * @param email - The email address of the user.
     * @param password - The password to compare.
     * @returns `true` if the passwords match, `false` otherwise.
     */
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

    /**
     * Hashes a password using bcryptjs.
     * @param password - The password to hash.
     * @returns The hashed password.
     */
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
