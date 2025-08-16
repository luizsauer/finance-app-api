// src\use-cases\create-user.js
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { PostgresCreateUserRepository } from '../db/postgres/repositories/postgres/create-user.js'
import { PostgresGetUserByEmailRepository } from '../db/postgres/repositories/postgres/get-user-by-email.js'

export class CreateUserUseCase {
    // constructor(userRepository) {
    //     this.userRepository =
    //         userRepository || new PostgresCreateUserRepository()
    // }

    async execute(userData) {
        // verificar se o email já está em uso
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()
        const userWithProvidedEmail =
            await postgresGetUserByEmailRepository.execute(userData.email)
        if (userWithProvidedEmail) {
            throw new Error('Email already in use')
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
        const postgresCreateUserRepository = new PostgresCreateUserRepository()
        const createUser = await postgresCreateUserRepository.execute(user)

        return createUser
    }
}
