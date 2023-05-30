import { DataSource } from "typeorm";
import { User, ChatMessage } from "./chat";

const chatDataSource = new DataSource({
  host: "localhost",
  type: "postgres",
  port: 5432,
  database: "",
  username: "",
  password: "",
  entities: [
    User,
    ChatMessage,
  ],
  synchronize: true
})


export default chatDataSource;
