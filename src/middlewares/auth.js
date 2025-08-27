import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    try {
        console.log('Autenticando usuário...')
        const accessToken = req.headers?.authorization?.split('Bearer ')[1]
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token missing' })
        }

        // Aqui você deve verificar se o token é válido
        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )

        if (!decodedToken) {
            return res.status(401).send({ message: 'Access token missing' })
        }

        req.userId = decodedToken.userId

        next()
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error)
        return res.status(401).send({ message: 'Access token missing' })
    }
}
