import { User } from "./../entities/user.entity";

export interface IcreateSession{
    user: User
    jwt_secret: string
    platform_version: string
    device_id: string
    socket_id: string 
}