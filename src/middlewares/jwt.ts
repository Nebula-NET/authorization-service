import {Request, Response, NextFunction} from 'express'
import { SessionSerivce } from './../services/session.service';
import { Exception, HandleError } from './../handlesErrors/handleError'
import { Session } from './../entities/session.entity';
import * as jsonWebToken from 'jsonwebtoken';


export async function verifyUser(req: Request, res: Response, next: NextFunction){
    const sessionService = new SessionSerivce()

    try {
        let token = req.headers['authorization']
        let deviceId: string|any = req.headers['device-id'];
        if(!token){
            throw new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
        }else{
            token= token.split(' ')[1];
        }
        let session: Session = await sessionService.findByDeviceId(deviceId);
        if(!session){
            throw new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
        }
        const tokenPayload: any = jsonWebToken.verify(token , session.jwt_secret);                
        req.headers['user-id'] = tokenPayload.id 
        next()
    } catch (err) {
        let error = new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
        HandleError(res, error)
    }

}