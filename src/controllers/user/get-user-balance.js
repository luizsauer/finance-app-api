import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }

    async execute(httpRequest) {
        try {
            const user_id = httpRequest.params.user_id

            const idError = checkIfIdIsValid(user_id)
            if (idError) {
                return idError
            }

            const balance = await this.getUserBalanceUseCase.execute(user_id)

            return ok(balance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError(error)
        }
    }
}
