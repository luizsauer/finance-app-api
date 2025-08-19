// src\adapters\id-generator.js
import { v4 as uuidv4 } from 'uuid'
export class IdGeneratorAdapter {
    execute() {
        return uuidv4()
    }
}
