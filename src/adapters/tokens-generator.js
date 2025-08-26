import jwt from 'jsonwebtoken'

export class TokenGeneratorAdapter {
    execute(userId) {
        return {
            accessToken: jwt.sign(
                { userId },
                process.env.JWT_ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '15m',
                },
            ),
            refreshToken: jwt.sign(
                { userId },
                process.env.JWT_REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '30d',
                },
            ),
        }
    }
}
