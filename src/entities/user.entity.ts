import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'


@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @Column({nullable: false})
    emial: string

    @Column({nullable: false})
    phone_number: string

    @Column({nullable: false, default: false})
    emial_verified: boolean

    @Column({nullable: false, default: false})
    phone_number_verified: boolean

    @Column({nullable: false , type: 'boolean' , default: true})
    active: boolean
} 