import { DataSource } from "typeorm";
import { User, ChatMessage } from "./chat";

const chatDataSource = new DataSource({
  host: "localhost",
  type: "postgres",
  port: 5432,
  database: "akz",
  username: "postgres",
  password: "1234",
  entities: [
    User,
    ChatMessage,
  ],
  synchronize: true
})


export default chatDataSource;
