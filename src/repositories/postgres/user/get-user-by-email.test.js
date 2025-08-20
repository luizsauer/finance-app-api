import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakerUser } from '../../../tests'
import { GetUserByEmailRepository } from './get-user-by-email.js'

describe('GetUserByEmailRepository', () => {
    it('should return user if email exists', async () => {
        const user = await prisma.user.create({ data: fakerUser })

        const sut = new GetUserByEmailRepository()

        const result = await sut.execute(user.email)

        expect(result).toEqual(user)
    })

    it('should return null if email does not exist', async () => {
        const sut = new GetUserByEmailRepository()

        const result = await sut.execute(faker.internet.email())

        expect(result).toBeNull()
    })

    it('should call Prisma with correct params', async () => {
        const sut = new GetUserByEmailRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(fakerUser.email)

        expect(prismaSpy).toHaveBeenCalledTimes(1)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: { email: fakerUser.email },
        })
    })
})
