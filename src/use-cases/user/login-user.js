// src\use-cases\user\login-user.js

import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

export class LoginUserUseCase {
    constructor(getUserByEmailRepository, passwordComparator, tokensGenerator) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordComparator = passwordComparator
        this.tokensGenerator = tokensGenerator
    }

    async execute(email, password) {
        // verificar se o email é valido ( se há usuario com esse email)
        const user = await this.getUserByEmailRepository.execute(email)
        if (!user) {
            throw new UserNotFoundError()
        }

        // verificar se a senha recebida é valida
        const isPasswordValid = await this.passwordComparator.execute(
            password,
            user.password,
        )
        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }
        // gerar os tokens
        const tokens = this.tokensGenerator.execute(user.id)

        return { ...user, tokens }
    }
}
