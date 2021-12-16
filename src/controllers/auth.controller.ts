import { checkUserTokenDTO, registerUserDTO } from "./../dto/user.dto";
import { Router, Request, Response, NextFunction } from "express";
import { Exception, HandleError } from "./../handlesErrors/handleError";
import { UserService } from "./../services/user.service";
import { User } from "./../entities/user.entity";
import { sendOtpDTO } from "./../dto/otp.dto";
import { MailService } from "./../services/mail.service";
import { RedisService } from "./../services/redis.service";
import { SessionSerivce } from "./../services/session.service";
import { IResponse } from "./../interfaces/response.interface";
import * as otpGenerator from 'otp-generator'
import {v4 as UUID} from 'uuid'
import { IcreateSession } from "interfaces/session.interface";
import {apiLimiter} from './../middlewares/rateLimit'
import { Session } from "./../entities/session.entity";
import * as jsonWebToken from 'jsonwebtoken';
import { verifySerivce, verifyUser } from "./../middlewares/jwt";
import { FederationService } from "./../services/federation.service";

export class AuthController{
    public path: String = "/authorization";
	public router = Router();

    private userService: UserService
    private mailService: MailService
    private redisService: RedisService
    private sessionService: SessionSerivce
    private federationService: FederationService

    constructor(){
        this.intialRouts();
        this.userService = new UserService()
        this.mailService = new MailService()
        this.redisService = new RedisService()
        this.sessionService = new SessionSerivce()
        this.federationService = new FederationService()

    }

    private intialRouts(){
        this.router.post('/login', apiLimiter, (req, res)=>this.login(req, res));
        this.router.post('/send-otp', apiLimiter, (req, res)=>this.sentOtp(req, res));
        this.router.post('/check-token', apiLimiter, verifySerivce, (req, res)=>this.checkToken(req, res))
    }

    public async login(req: Request, res:Response){
        let data = new registerUserDTO(req.body)
        let deviceId: string|any = req.headers['device-id'];
        let platformVersion: string|any = req.headers['platform-version'];
        
        //validate request body
        try {
			let error = await data.validate();
			if (error) {
				res.status(400).json(error);
				return;
			}
		} catch (error) {
			HandleError(res, error)
			return;
		}

        let user:User;
        try {
            user = await this.userService.findByEmail(data.email);

            const otpCode = await this.redisService.get(data.email);
            if(data.otp_code !== otpCode){
                throw new Exception(400, 'کد احراز هویت وارد شده معتبر نمی باشد');
            }
            
            if(!user){ // create user if not exist
                user = await this.userService.create(data);
            }

            const tokenPayload = {
				id: user.id,
				device: deviceId,
                platform: platformVersion
			};

            const tokenSecret = UUID() // uuid version 4 

			let accessToken = jsonWebToken.sign(tokenPayload, tokenSecret); 
            const sessionObj: IcreateSession = {
                device_id: deviceId,
                platform_version: platformVersion,
                jwt_secret: tokenSecret,
                socket_id: '',
                user: user
            }

            let session = await this.sessionService.findByDeviceId(deviceId)
            if(session){  // delete session for same device
                await this.sessionService.delete(session.id)
            }
            await this.sessionService.create(sessionObj)


            const response: IResponse = {
                success: true,
                message: '',
                data: {
                    email: user.email,
                    access_token: accessToken
                }
            }

            res.status(200).json(response)
            
        } catch (error) {
            HandleError(res, error)
        }

    }


    public async sentOtp(req: Request, res:Response){
        let data = new sendOtpDTO(req.body);

        //validate request body
        try {
			let error = await data.validate();
			if (error) {
				res.status(400).json(error);
				return;
			}
		} catch (error) {
			HandleError(res, error)
			return;
		}

        try {
            let code = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
            await this.redisService.set(data.email, code)
            let mailResult = await this.mailService.sendOTP(data.email, code)
            const response: IResponse = {
                success: true,
                message: 'کد احراز هویت برای شما ارسال شد',
                data: null
            }
            res.status(200).json(response)
        } catch (error) {
            HandleError(res, error)
			return;
        }

    }

    public async checkToken(req: Request, res:Response){
        let data = new checkUserTokenDTO(req.body);
        //validate request body
        try {
			let error = await data.validate();
			if (error) {
				res.status(400).json(error);
				return;
			}
		} catch (error) {
			HandleError(res, error)
			return;
		}

        try {
            let token = data.token;
            token = token.split(' ')[1];            
            let session: Session = await this.sessionService.findByDeviceId(data.device_id);            
            if(!session){
                throw new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
            }
            const tokenPayload: any = jsonWebToken.verify(token , session.jwt_secret);       
            const user = await this.userService.findById(tokenPayload.id);
            const federation = await this.federationService.findByPublickey(data.publickey);
            
            if(federation.user.id != user.id){
                throw new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
            }

            if(!user.active){
                throw new Exception(401, 'حساب شما غیر فعال شده است');
            }

            const response: IResponse = {
                success: true,
                message: '',
                data: {
                    email: user.email,
                    publickey: data.publickey
                }
            }
            res.status(200).json(response)
            
        } catch (err) {            
            if(err instanceof Exception){
                HandleError(res, err)
            }else{
                let error = new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
                HandleError(res, error)
            }
            
        }
    }



}