// src\use-cases\create-user.js
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { PostgresGetUserByEmailRepository } from '../db/postgres/repositories/postgres/index.js'
import EmailAlreadyInUseError from '../errors/user.js'

export class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository
        this.postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()
    }

    async execute(userData) {
        // verificar se o email já está em uso

        const userWithProvidedEmail =
            await this.postgresGetUserByEmailRepository.execute(userData.email)

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(userData.email)
        }

        // Generate a unique ID for the user
        const userId = uuidv4()

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(userData.password, 10)

        // Create the user using the repository
        const user = {
            id: userId,
            ...userData,
            password: hashedPassword,
        }

        // call the repository to create the user

        const createUser = await this.userRepository.execute(user)

        return createUser
    }
}
