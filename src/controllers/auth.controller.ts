import { registerUserDTO } from "./../dto/user.dto";
import { Router, Request, Response, NextFunction } from "express";
import { Exception, HandleError } from "./../handlesErrors/handleError";
import { UserService } from "./../services/user.service";
import { User } from "./../entities/user.entity";
import { sendOtpDTO } from "./../dto/otp.dto";
import { MailService } from "./../services/mail.service";
import { RedisService } from "./../services/redis.service";
import { IResponse } from "interfaces/response.interface";
import * as otpGenerator from 'otp-generator'

export class AuthController{
    public path: String = "/authorization";
	public router = Router();

    private userService: UserService
    private mailService: MailService
    private redisService: RedisService

    constructor(){
        this.intialRouts();
        this.userService = new UserService()
        this.mailService = new MailService()
        this.redisService = new RedisService()

    }

    private intialRouts(){
        this.router.post('/register', (req, res)=>this.register(req, res));
        this.router.post('/send-otp', (req, res)=>this.sentOtp(req, res));
    }

    public async register(req: Request, res:Response){
        let data = new registerUserDTO(req.body)

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
        try { // check email
            user = await this.userService.findByEmail(data.email);
            if(user){
                throw new Exception(400, 'کاربری با این ایمیل وجود دارد')
            }
        } catch (error) {
            HandleError(res, error)
			return;  
        }


        try {
            const otpCode = await this.redisService.get(data.email);
            if(data.otp_code !== otpCode){
                throw new Exception(400, 'کد احراز هویت وارد شده معتبر نمی باشد');
            }

            user = await this.userService.createUser(data);

            const response: IResponse = {
                success: true,
                message: '',
                data: user
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