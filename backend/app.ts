import express from "express";
import { attachControllers } from "@decorators/express";
import { ChatMessage, User } from "./database/chat";

import cors from "cors";
import ChatController from "./controllers/chat";
import database from "./database/database"
import "reflect-metadata"
import { DataSource } from "typeorm";

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;



const checkIfNotPopulated = async () => {
  try {
    let users = await User.find()
    if (users.length > 0) {
      return;
    } else {
        let user1 = new User();
        let uesr2 = new User();
        let user3 = new User();
        user1.id = 1;
        uesr2.id = 2;
        user3.id = 0;
        user1.name = "John Doe";
        uesr2.name = "David Johnson";
        user3.name = "";
        user1.profileBackDropPath = "1.jpg";
        uesr2.profileBackDropPath = "4.jpg";
        user3.profileBackDropPath = "";

        let message1 = new ChatMessage();
        let message2 = new ChatMessage();
        let message3 = new ChatMessage();
        let message4 = new ChatMessage();

        message1.content = "Hi";
        message1.userId = 1;
        message1.toUserId = 0;
        message2.content = "Hello";
        message2.userId = 2;
        message2.toUserId = 0;
        message3.userId = 0;
        message3.content = "to first user";
        message3.toUserId = 1;
        message4.userId = 0;
        message4.content = "to second user";
        message4.toUserId = 2;
        try {
          await User.save(user1);
          await User.save(uesr2);
          await User.save(user3);
          await ChatMessage.save(message1);
          await ChatMessage.save(message2);
          await ChatMessage.save(message3);
          await ChatMessage.save(message4);
        } catch(e) {
          console.log(e)
        }

      
    }
  } catch(e) {
    console.log(e);
  }
}

attachControllers(app, [ChatController])


database.initialize()
  .then(connection => {
    return checkIfNotPopulated();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`The app is listening on port http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('An error occurred:', error);
  })










