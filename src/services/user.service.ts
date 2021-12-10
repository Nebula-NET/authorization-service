import { User } from "./../entities/user.entity";
import { getRepository } from "typeorm";
import { registerUserDTO } from "./../dto/user.dto";


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

    public async createUser(data: registerUserDTO):Promise<User>{
        let user: User = new User();
        user.email = data.email;
        user.email_verified = true;
        user.created_at = new Date()

        await user.save();

        return user
    }

}