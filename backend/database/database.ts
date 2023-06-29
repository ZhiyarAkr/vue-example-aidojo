import { DataSource } from "typeorm";
import User from "./User";
import Conversation from "./Conversation";
import ChatMessage from "./ChatMessage";

const chatDataSource = new DataSource({
  host: "localhost",
  type: "postgres",
  port: 5432,
  database: "akz_chat",
  username: "postgres",
  password: "1234",
  entities: [
    User,
    Conversation,
    ChatMessage,
  ],
  synchronize: true
})


export default chatDataSource;
