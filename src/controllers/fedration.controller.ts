import {Router, Request, Response} from 'express'
import { verifyUser } from './../middlewares/jwt';

export class FederationController{
    public path: String = "/federation";
	public router = Router();

    constructor(){
        this.initalRoute()
    }


    private initalRoute(){
        this.router.post('/', verifyUser, (req, res) => this.newFederation(req, res))
    }



    public async newFederation(req: Request, res: Response){

    }

}