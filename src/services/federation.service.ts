import { Federation } from "./../entities/federation.entity";
import { getRepository } from "typeorm";
import { registerUserDTO } from "./../dto/user.dto";
import { IcreateFederation } from "./../interfaces/federation.interface";
import { User } from "./../entities/user.entity";


export class FederationService{

    private federationRepository = getRepository(Federation)


    constructor(){

    }


    public async findById(id: number):Promise<Federation | null>{
        let federation:Federation = await this.federationRepository.findOne({id: id}, {relations: ['user']});
        return federation
    }

    public async findByPublickey(publickey: string):Promise<Federation | null>{
        let federation:Federation = await this.federationRepository.findOne({public_key: publickey}, {relations: ['user']});
        return federation
    }

    public async updateOwner(id: number, user: User):Promise<Federation>{
        await this.federationRepository.update({id: id}, {user: user})
        let federation = await this.federationRepository.findOne({id: id});
        return federation
    }

    public async create(data: IcreateFederation):Promise<Federation>{
        let federation = new Federation();
        federation.user = data.user;
        federation.public_key = data.publickey
        await federation.save();
        return federation;
    }



}