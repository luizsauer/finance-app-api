import {
    CreateUserController,
    DeleteUserController,
    GetUserBalanceController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers'
import { makeGetUserBalanceController } from './transactions'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeUpdateUserController,
    makeUserByIdController,
} from './user.js'

describe('User Controller Factories', () => {
    it('should return a valid GetUserByIdController instance', () => {
        expect(makeUserByIdController()).toBeInstanceOf(GetUserByIdController)
    })

    it('should return a valid CreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })

    it('should return a valid DeleteUserController instance', () => {
        expect(makeDeleteUserController()).toBeInstanceOf(DeleteUserController)
    })

    it('should return a valid UpdateUserController instance', () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
    })

    it('should return a valid GetUserBalanceController instance', () => {
        expect(makeGetUserBalanceController()).toBeInstanceOf(
            GetUserBalanceController,
        )
    })
})
