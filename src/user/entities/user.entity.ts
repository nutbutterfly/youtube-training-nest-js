import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 60 })
    email: string;

    @Column({ length: 60 })
    password: string;

    @Column({ length: 60, default: null })
    firstName: string;

    @Column({ length: 60, default: null })
    lastName: string;

    @Column({ default: true })
    isActive: boolean;

}