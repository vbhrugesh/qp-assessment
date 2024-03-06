declare global {
    namespace Express {
        interface User extends IUserModel {
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
