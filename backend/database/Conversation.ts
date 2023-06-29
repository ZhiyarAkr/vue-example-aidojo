import { BaseEntity, Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, JoinTable, Relation } from "typeorm";
import ChatMessage from "./ChatMessage";
import User from "./User";


@Entity()
export default class Conversation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => ChatMessage, (message) => message.conversation)
    messages: ChatMessage[];

    @ManyToMany(() => User, (user) => user.conversations)
    @JoinTable()
    users: User[];
}