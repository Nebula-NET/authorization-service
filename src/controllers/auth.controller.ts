import { registerUserDTO } from "./../dto/user.dto";
import { Router, Request, Response, NextFunction } from "express";
import { Exception, HandleError } from "./../handlesErrors/handleError";
import { UserService } from "./../services/user.service";
import { User } from "./../entities/user.entity";
import { sendOtpDTO } from "./../dto/otp.dto";
import { MailService } from "./../services/mail.service";
import { RedisService } from "./../services/redis.service";
import { SessionSerivce } from "./../services/session.service";
import { IResponse } from "interfaces/response.interface";
import * as otpGenerator from 'otp-generator'
import * as jwt from "jsonwebtoken";
import {v4 as UUID} from 'uuid'
import { IcreateSession } from "interfaces/session.interface";
import { logger } from "server";

export class AuthController{
    public path: String = "/";
	public router = Router();

    private userService: UserService
    private mailService: MailService
    private redisService: RedisService
    private sessionService: SessionSerivce

    constructor(){
        this.intialRouts();
        this.userService = new UserService()
        this.mailService = new MailService()
        this.redisService = new RedisService()
        this.sessionService = new SessionSerivce()

    }

    private intialRouts(){
        this.router.post('/login', (req, res)=>this.login(req, res));
        this.router.post('/send-otp', (req, res)=>this.sentOtp(req, res));
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

			let accessToken = jwt.sign(tokenPayload, tokenSecret); 
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



}