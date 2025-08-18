import validator from 'validator'
import { z } from 'zod'

export const createTransactionSchema = z
    .object({
        user_id: z.string().uuid(),
        name: z
            .string()
            .trim()
            .min(3, 'Name must be at least 3 characters long'),
        date: z.coerce.date('Invalid date format'),
        type: z.enum(
            ['EXPENSE', 'EARNING', 'INVESTMENT'],
            'Invalid transaction type',
        ),
        amount: z.number().min(0, 'Amount must be a positive number'),
    })
    .refine((value) =>
        validator.isCurrency(value.amount.toFixed(2), {
            digits_after_decimal: [2],
            allow_negatives: false,
            decimal_separator: '.',
        }),
    )
