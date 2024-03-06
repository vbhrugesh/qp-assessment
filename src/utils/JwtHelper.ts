import fs from "fs"
import path from "path"

import {
    sign as JWTSign,
    verify,
    SignOptions,
    VerifyOptions,
} from "jsonwebtoken"

interface DecodedResult {
    valid: boolean
    expired: boolean
    decoded: unknown | null
}

const privateKey = fs.readFileSync(
    path.join(__dirname, "../../private.key"),
    "utf8"
)
const publicKey = fs.readFileSync(
    path.join(__dirname, "../../public.key"),
    "utf8"
)

export default class JwtHelper {
    private privateKey: string = privateKey
    private publicKey: string = publicKey

    /**
     * Used to decode the given payload into a JWT string
     *
     * @param token string
     * @param verifyOptions jwt.VerifyOptions
     * @returns DecodedResult
     */
    public decode(token: string, { algorithms }: VerifyOptions): DecodedResult {
        try {
            const decoded = verify(token, this.publicKey, { algorithms })

            return {
                valid: true,
                expired: false,
                decoded,
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "JWT expired"
            return {
                valid: false,
                expired: errorMessage === "JWT expired",
                decoded: null,
            }
        }
    }
    /**
     * Used to decode the JWT string
     *
     * @param object {[key: string]: unknown}
     * @param options jwt.SignOptions | undefined
     * @returns string
     */
    public sign(
        object: { [key: string]: unknown },
        options?: SignOptions
    ): string {
        return JWTSign(object, this.privateKey, options)
    }
}
