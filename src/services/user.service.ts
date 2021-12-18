import { User } from "./../entities/user.entity";
import { getRepository } from "typeorm";


export class UserService{

    private userRepository = getRepository(User)


    constructor(){

    }


    public async findById(userId: number):Promise<User | null>{
        let user:User = await this.userRepository.findOne({id: userId});
        return user
    }

    public async findByEmail(email: string):Promise<User | null>{
        let user:User = await this.userRepository.findOne({email : email});
        return user
    }

    public async create(email: string = null):Promise<User>{
        let user: User = new User();
        user.email = email;
        user.email_verified = email ? true : false
        user.created_at = new Date()

        await user.save();

        return user
    }



}