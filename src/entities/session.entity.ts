import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { User } from './user.entity'


@Entity()
export class Session extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @ManyToOne(() => User)
    user: User

    @Column({nullable: false})
    jwt_secret: string

    @Column({nullable: false})
    platform_version: string

    @Column({nullable: false})
    socket_id: string

    @Column({nullable: false , type: 'boolean' , default: true})
    active: boolean
} 