import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, Relation } from "typeorm";
import ChatMessage from "./ChatMessage";
import Conversation from "./Conversation";

@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    profileBackDropPath: string;

    @Column({unique: true, select: false})
    username: string;

    @Column({select: false})
    password: string;

    @Column({select: false})
    authToken: string;

    @OneToMany(() => ChatMessage, (message) => message.user)
    messages: ChatMessage[]

    @ManyToMany(() => Conversation, (conversation) => conversation.users)
    conversations: Conversation[]

}