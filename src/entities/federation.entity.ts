import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {User} from './user.entity'

@Entity()
export class Federation extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @Column({nullable: false})
    public_key: string

    @ManyToOne(() => User)
    user: User
} 