import { Request } from "express"
import passport from "passport"
// eslint-disable-next-line import/default
import passportLocal from "passport-local"

import { IUser } from "../interfaces/IUser"
import UserModel from "../models/UserModel"

const LocalStrategy = passportLocal.Strategy

/**
 * @param {Request} req - The request object.
 * @param {IUser} user - The user object.
 * @param {Function} done - The callback function.
 * @description This function serializes the user object and passes it to the next middleware function in the stack.
 */
passport.serializeUser(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req: Request, user: IUser, done: (err: unknown, user?: IUser) => void) => {
        done(null, user)
    }
)
/**
 * @param {Request} req - The request object.
 * @param {IUser} user - The user object.
 * @param {Function} done - The callback function.
 * @description This function serializes the user object and passes it to the next middleware function in the stack.
 */
passport.deserializeUser(async (user: IUser, done) => {
    try {
        const u = await UserModel.findById(
            new mongoose.Types.ObjectId(user.id)
        ).exec()
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
            const criteria = username.includes("@")
                ? { email: username.toLowerCase() }
                : { phoneNo: username.toLowerCase() }
            const user = await UserModel.findOne(criteria).exec()

            if (!user) {
                return done(undefined, false, {
                    message: `Email/ Phone ${username} not found.`,
                })
            }

            user.comparePassword(password, (error, isMatch: boolean) => {
                if (error) {
                    return done(error)
                }

                if (isMatch) {
                    return done(undefined, user)
                }

                return done(undefined, false, {
                    message: "Invalid email or password.",
                })
            })
        }
    )
)
