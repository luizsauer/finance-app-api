import validator from 'validator'
import { IdGeneratorAdapter } from './id-generator'

describe('IdGeneratorAdapter', () => {
    it('should generate a valid UUID', async () => {
        const sut = new IdGeneratorAdapter()
        const result = await sut.execute()

        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(validator.isUUID(result)).toBe(true)
    })
})
