import { IUser } from "../interfaces/IUser"

declare global {
    namespace Express {
        interface User extends IUser {
            id?: string
        }
        interface Request {
            user?: User
        }
    }
    interface Error {
        status?: number
        message?: string
    }
}
