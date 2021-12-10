import {Request , Response ,  NextFunction } from 'express';
import { Exception, HandleError } from './../handlesErrors/handleError';

export function checkLanguage(req : Request , res : Response , next:NextFunction){
    try {
        const lang = req.headers['accept-language'];
        if(!lang){
            throw new Exception(400, 'سربرگ Accept-Language وجود ندارد')
        }
        const languages = ['fa', 'en']
        if(!languages.includes(lang.toString())){
            req.headers['accept-language'] = 'en'; 
        }
        next();
    } catch (error) {
        HandleError(res, error)
    }
}