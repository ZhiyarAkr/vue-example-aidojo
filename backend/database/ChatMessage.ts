import { BaseEntity, Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, JoinTable, Relation } from "typeorm";
import Conversation from "./Conversation";
import User from "./User";


@Entity()
export default class ChatMessage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @CreateDateColumn()
    date: Date;

    @ManyToOne(() => Conversation, (conversation) => conversation.messages)
    conversation: Conversation

    @ManyToOne(() => User, (user) => user.messages, {eager: true})
    user: User
}