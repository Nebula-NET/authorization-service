import { User } from "./../entities/user.entity";

export interface IcreateFederation{
    user: User,
    publickey: string
}