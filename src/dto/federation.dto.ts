import {IsNotEmpty  , validate, IsEmail} from 'class-validator'
import { IResponse } from './../interfaces/response.interface';

export class newFederationDTO{
    constructor(data:any){
        this.publickey = data.publickey
        this.signature = data.signature
    }


    @IsNotEmpty({message: 'کلید عمومی خود را وارد کنید'})
    publickey: string;

    @IsNotEmpty({message: 'امضای خود را وارد کنید'})
    signature: string;

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
