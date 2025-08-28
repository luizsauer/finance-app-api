import { UnauthorizedError } from '../../errors/index.js'

export class RefreshTokenUseCase {
    constructor(tokensGeneratorAdapter, tokenVerifierAdapter) {
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
        this.tokenVerifierAdapter = tokenVerifierAdapter
    }

    execute(refreshToken) {
        try {
            //verificar se o refreshtoken é valido
            const decodedToken = this.tokenVerifierAdapter.execute(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET,
            )

            if (!decodedToken) {
                throw new UnauthorizedError()
            }

            return this.tokensGeneratorAdapter.execute(decodedToken.user_id)
        } catch (error) {
            console.log(error)
            throw new UnauthorizedError()
        }
    }
}
