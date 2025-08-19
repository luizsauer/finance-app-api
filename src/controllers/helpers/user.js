// src\controllers\helpers\user.js

import { notFound } from './http.js'

export const userNotFoundResponse = () =>
    notFound({
        message: 'User not found',
    })
