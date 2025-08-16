import { DeleteUserUseCase } from '../use-cases/index.js'
import { checkIfIdIsValid, notFound, ok, serverError } from './helpers/index.js'

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const idError = checkIfIdIsValid(userId)
            if (idError) {
                return idError
            }

            const deleteUserUseCase = new DeleteUserUseCase()
            const deletedUser = await deleteUserUseCase.execute(userId)

            if (!deletedUser) {
                return notFound({ message: 'User not found' })
            }
            return ok({ message: 'User deleted successfully' })
        } catch (error) {
            console.error('Error executing delete user', error)
            return serverError(error)
        }
    }
}
