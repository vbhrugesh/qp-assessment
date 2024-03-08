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

export default class JwtHelper {
    private SECRET_KEY = "SECRET_KEY"

    /**
     * Used to decode the given payload into a JWT string
     *
     * @param token string
     * @param verifyOptions jwt.VerifyOptions
     * @returns DecodedResult
     */
    public decode(token: string, { algorithms }: VerifyOptions): DecodedResult {
        try {
            const decoded = verify(token, this.SECRET_KEY, { algorithms })

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
        return JWTSign(object, this.SECRET_KEY, options)
    }
}
