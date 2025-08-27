// src\schemas\user.js

import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z
        .string('First name is required')
        .trim()
        .min(3, 'First name must be at least 3 characters long'),
    last_name: z
        .string('Last name is required')
        .trim()
        .min(3, 'Last name must be at least 3 characters long'),
    email: z.string('Invalid email format').email().trim(),
    password: z
        .string('Password is required')
        .trim()
        .min(6, 'Password must be at least 6 characters long'),
})

export const updateUserSchema = createUserSchema
    .partial()
    .strict({ message: 'Some provided field is not allowed.' })

export const loginSchema = z.object({
    email: z.email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})
