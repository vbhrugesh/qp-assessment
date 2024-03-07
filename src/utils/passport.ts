import { User } from "@prisma/client"
import { Request } from "express"
import passport from "passport"
// eslint-disable-next-line import/default
import passportLocal from "passport-local"

import UserModel from "../models/UserModel"

const LocalStrategy = passportLocal.Strategy
const userModel = new UserModel()

/**
 * @param {Request} req - The request object.
 * @param {User} user - The user object.
 * @param {Function} done - The callback function.
 * @description This function serializes the user object and passes it to the next middleware function in the stack.
 */
passport.serializeUser(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req: Request, user: User, done: (err: unknown, user?: User) => void) => {
        done(null, user)
    }
)
/**
 * @param {Request} req - The request object.
 * @param {User} user - The user object.
 * @param {Function} done - The callback function.
 * @description This function serializes the user object and passes it to the next middleware function in the stack.
 */
passport.deserializeUser(async (user: User, done) => {
    try {
        const u = await userModel.findUser(user.id)
        done(null, u)
    } catch (error) {
        done(error)
    }
})

/**
 * Sign in using Email and Password.
 */
passport.use(
    "user-local",
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (username, password, done) => {
            const user = await userModel.findUserByEmail(username)
            if (!user) {
                return done(undefined, false, {
                    message: `Email/ Phone ${username} not found.`,
                })
            }
            const isMatch = await userModel.comparePassword(username, password)
            if (!isMatch) {
                return done(undefined, false, {
                    message: `Invalid email or password.`,
                })
            }

            return done(undefined, user)
        }
    )
)
