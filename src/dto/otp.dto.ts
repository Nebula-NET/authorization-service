import {IsNotEmpty  , validate, IsEmail} from 'class-validator'
import { IResponse } from './../interfaces/response.interface';

export class sendOtpDTO{
    constructor(data:any){
        this.email = data.email;
    }

    @IsNotEmpty({message: 'ایمیل خود را وارد کنید'})
    @IsEmail()
    email: string;

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

export class getChallengeDTO{
    constructor(data:any){
        this.publickey = data.publickey;
    }

    @IsNotEmpty({message: 'کلید عمومی خود را وارد کنید'})
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
