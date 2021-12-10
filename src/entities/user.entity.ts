import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'


@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @Column({nullable: true, default: null})
    email: string

    @Column({nullable: true, default: null})
    phone_number: string

    @Column({nullable: false, default: false})
    email_verified: boolean

    @Column({nullable: false, default: false})
    phone_number_verified: boolean

    @Column({nullable: false , type: 'boolean' , default: true})
    active: boolean

    @Column({nullable: false , type: 'timestamp'})
    created_at: Date
} 