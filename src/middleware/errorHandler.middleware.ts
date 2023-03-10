import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import CustomError from '@/errors/custom.error'

const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let customError: CustomError = {
        name: err.name || 'error',
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong, please try again later',
    }

    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors)
            .map((item: any) => item.message)
            .join(',')
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value`
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if (err.name === 'CastError') {
        customError.message = `No item found with id : ${err.value}`
        customError.statusCode = StatusCodes.NOT_FOUND
    }

      return res.status(customError.statusCode).json({ message: customError.message })
}

export default errorHandlerMiddleware
