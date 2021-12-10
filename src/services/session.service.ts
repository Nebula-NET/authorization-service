import { Session } from "./../entities/session.entity";
import { getRepository } from "typeorm";
import { IcreateSession } from "./../interfaces/session.interface";


export class SessionSerivce{

    private sessionRepository = getRepository(Session)

    constructor(){
        
    }

    public async findByDeviceId(deviceId: string):Promise<Session | null>{  
        return await this.sessionRepository.findOne({device_id: deviceId});
    }

    public async create(data: IcreateSession):Promise<Session>{
        let session = new Session();
        session.device_id = data.device_id
        session.platform_version = data.platform_version
        session.jwt_secret = data.jwt_secret
        session.user = data.user
        session.socket_id = data.socket_id
        session.active = true
        await session.save()
        return session
    }

    public async delete(sessionId: number){
        await this.sessionRepository.delete({id: sessionId})
    }
}