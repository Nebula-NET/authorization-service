import {Request , Response ,  NextFunction } from 'express';
import { IResponse } from '../interfaces/response.interface';



export function checkLanguage(req : Request , res : Response , next:NextFunction){
    try {
        const lang = req.headers['accept-language'];
        const languages = ['fa', 'en']
        if(!languages.includes(lang.toString())){
            req.headers['accept-language'] = 'en'; 
        }
        next();
    } catch (error) {
        let response:IResponse = {
            success: false,
            message: 'Accept-Language header is undefined',
            data: null
        }
        res.status(400).json(response)
    }
}