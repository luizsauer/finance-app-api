import jwt from 'jsonwebtoken'

export class TokenGeneratorAdapter {
    execute(user_id) {
        return {
            accessToken: jwt.sign(
                { user_id },
                process.env.JWT_ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '15m',
                },
            ),
            refreshToken: jwt.sign(
                { user_id },
                process.env.JWT_REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '30d',
                },
            ),
        }
    }
}
