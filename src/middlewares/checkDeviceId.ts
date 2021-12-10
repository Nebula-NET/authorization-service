import {Request , Response ,  NextFunction } from 'express';
import { Exception, HandleError } from './../handlesErrors/handleError';

export function checkDeviceId(req : Request , res : Response , next:NextFunction){
    try {
        const deviceId = req.headers['device-id'];
        const platformVersion = req.headers['platform-version'];
        if(!deviceId){
            throw new Exception(400, 'سربرگ Device-Id وجود ندارد')
        }
        if(!platformVersion){
            throw new Exception(400, 'سربرگ Platform-Version وجود ندارد')
        }
        next();
    } catch (error) {
        HandleError(res, error)
    }
}