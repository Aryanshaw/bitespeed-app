import createAPIError from '@/utils/error';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getTest = (req:Request, res:Response) => {
    try{
        // implement your logic here
        return res.status(200).send("Test retrieved successfully");
    } catch (e) {
        return createAPIError(StatusCodes.BAD_REQUEST, `Please provide gender and experience details`, res);
    }
}