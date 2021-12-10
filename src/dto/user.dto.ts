import {IsNotEmpty  , validate, IsEmail} from 'class-validator'
import { IResponse } from './../interfaces/response.interface';

export class registerUserDTO{
    constructor(data:any){
        this.email = data.email;
        this.otp_code = data.otp_code
    }

    @IsNotEmpty({message: 'ایمیل خود را وارد کنید'})
    @IsEmail()
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
