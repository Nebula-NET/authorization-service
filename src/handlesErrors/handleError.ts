import {Response} from 'express'
import { IResponse } from '../interfaces/response.interface';

export class Exception{
    public code;
    public message;
    constructor(code = 400 , message = 'خطایی پیش آمده، لطفا دوباره تلاش کنید.'){
        this.code = code;
        this.message = message
    }
}

export function HandleError(res:Response , error){
    if(error instanceof Exception){
        let errObj:IResponse = {
            success: false,
            message: error.message,
            data: null
        }
        res.status(error.code).json(errObj)
    }else{
        let errObj:IResponse = {
            success: false,
            message: 'خطایی پیش آمده، لطفا دوباره تلاش کنید.',
            data: null
        }
        console.log(error);
        res.status(400).json(errObj)
    }
}