import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './create-user'

describe('CreateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null // Simulate no user found
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const createUserRepository = new CreateUserRepositoryStub()
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordHasher = new PasswordHasherAdapterStub()
        const idGenerator = new IdGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            createUserRepository,
            getUserByEmailRepository,
            passwordHasher,
            idGenerator,
        )

        return {
            sut,
            createUserRepository,
            getUserByEmailRepository,
            passwordHasher,
            idGenerator,
        }
    }

    it('should create a user successfully', async () => {
        const { sut } = makeSut()

        const createdUser = await sut.execute({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
                // min: 8,
                // max: 20,
                // numeric: true,
                // special: true,
            }),
        })
        expect(createdUser).toBeTruthy()
    })

    it('should return an error if user data is invalid', async () => {
        // const { sut } = makeSut()
    })
})
