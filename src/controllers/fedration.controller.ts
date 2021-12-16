import { newFederationDTO } from './../dto/federation.dto';
import {Router, Request, Response} from 'express'
import { verifyUser } from './../middlewares/jwt';
import { Exception, HandleError } from "./../handlesErrors/handleError";
import * as StellarSdk from 'stellar-sdk'
import { UserService } from './../services/user.service';
import { User } from './../entities/user.entity';
import { FederationService } from './../services/federation.service';
import { IResponse } from './../interfaces/response.interface';
import { apiLimiter } from './../middlewares/rateLimit';
export class FederationController{
    public path: String = "/federation";
	public router = Router();
    private userService: UserService
    private federationService: FederationService

    constructor(){
        this.initalRoute()
        this.userService = new UserService()
        this.federationService = new FederationService()
    }


    private initalRoute(){
        this.router.post('/', apiLimiter , verifyUser, (req, res) => this.newFederation(req, res))
    }



    public async newFederation(req: Request, res: Response){
        let data = new newFederationDTO(req.body);
        let userId:any = req.headers['user-id']
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
            let user: User = await this.userService.findById(userId);            
            let keypair = StellarSdk.Keypair.fromPublicKey(data.publickey)
            let sigResult = StellarSdk.verify(Buffer.from(user.email, 'utf-8'), Buffer.from(data.signature, 'base64'), keypair.rawPublicKey())
            if(!sigResult){
                throw new Exception(400, 'امضای حساب صحیح نمی باشد')
            }
            let federation = await this.federationService.findByPublickey(data.publickey);
            
            if(!federation){
                federation = await this.federationService.create({publickey: data.publickey, user: user})
            }
            if(federation.user.id !== user.id){
                federation = await this.federationService.updateOwner(federation.id, user);
            }
            
            let response: IResponse = {
                success: true,
                message: 'حساب با موفقیت ثبت شد',
                data: {
                    publicKey: data.publickey
                }
            }

            res.status(200).json(response)
        } catch (error) {
            HandleError(res, error)
            return;
        }


    }

}