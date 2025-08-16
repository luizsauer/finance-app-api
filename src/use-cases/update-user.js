// src\use-cases\update-user.js
import bcrypt from 'bcryptjs'
import {
    PostgresGetUserByEmailRepository,
    PostgresUpdateUserRepository,
} from '../db/postgres/repositories/postgres/index.js'
import EmailAlreadyInUseError from '../errors/user.js'

export class UpdateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async execute(userId, updateUserParams) {
        // se o email estivesse sido alterado, precisamos verificar se já existe um usuário com o novo email
        if (updateUserParams.email) {
            // verificar se o email já está em uso
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }
        const user = {
            ...updateUserParams,
        }
        // se a senha estiver sendo alterada, precisamos garantir que a nova senha atenda aos requisitos de segurança
        if (updateUserParams.password) {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )
            user.password = hashedPassword
        }
        // se o nome estiver sendo alterado, precisamos garantir que o novo nome atenda aos requisitos de segurança
        if (updateUserParams.first_name || updateUserParams.last_name) {
            if (!updateUserParams.first_name || !updateUserParams.last_name) {
                throw new Error('O nome completo deve incluir nome e sobrenome')
            }
        }
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
        // call the repository to update the user
        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        )
        return updatedUser
    }
}
