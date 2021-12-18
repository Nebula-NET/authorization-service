import {IsNotEmpty  , validate, IsEmail} from 'class-validator'
import { IResponse } from './../interfaces/response.interface';

export class otpLoginDTO{
    constructor(data:any){
        this.email = data.email;
        this.otp_code = data.otp_code
    }

    @IsNotEmpty({message: 'ایمیل خود را وارد کنید'})
    email: string;

    @IsNotEmpty({message: 'کد احراز هویت خود را وارد کنید'})
    otp_code: string;

    public async validate():Promise<IResponse | null>{
        let errors = await validate(this);            
        if(errors.length > 0){
          const resData: IResponse = {
              success: false,
              message: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
              data: errors[0]
          }
          return resData
        } else {
            return null
        } 

    }
}

export class ChallengeLoginDTO{
    constructor(data:any){
        this.signature = data.signature
        this.publickey = data.publickey
    }

    @IsNotEmpty({message: 'امضا نباید خالی باشد'})
    signature: string;

    @IsNotEmpty({message: 'کلید عمومی نباید خالی باشد'})
    publickey: string;

    public async validate():Promise<IResponse | null>{
        let errors = await validate(this);            
        if(errors.length > 0){
          const resData: IResponse = {
              success: false,
              message: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
              data: errors[0]
          }
          return resData
        } else {
            return null
        } 

    }
}

export class checkUserTokenDTO{
    constructor(data:any){
        this.device_id = data.device_id;
        this.token = data.token
        this.publickey = data.publickey
    }

    @IsNotEmpty({message: 'شناسه دستگاه نباید خالی باشد'})
    device_id: string;

    @IsNotEmpty({message: 'توکن نباید خالی باشد'})
    token: string;

    @IsNotEmpty({message: 'کلید عمومی نباید خالی باشد'})
    publickey: string;

    public async validate():Promise<IResponse | null>{
        let errors = await validate(this);            
        if(errors.length > 0){
          const resData: IResponse = {
              success: false,
              message: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
              data: errors[0]
          }
          return resData
        } else {
            return null
        } 

    }
}
