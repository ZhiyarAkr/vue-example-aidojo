import { BaseEntity, Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";


@Entity()
class User extends BaseEntity {
    @PrimaryColumn()
    id: Number;

    @Column()
    name: String;

    @Column()
    profileBackDropPath: String;
}


@Entity()
class ChatMessage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    userId: Number;

    @Column()
    content: String;

    @CreateDateColumn()
    date: Date;

    @Column()
    toUserId: Number;
}


export {User, ChatMessage}