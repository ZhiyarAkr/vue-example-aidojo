import express from "express";
import { attachControllers } from "@decorators/express";
import ChatMessage from "./database/ChatMessage";
import User from "./database/User";
import Conversation from "./database/Conversation";

import cors from "cors";
import ChatController from "./controllers/chat";
import AuthController from "./controllers/authController";
import database from "./database/database"
import "reflect-metadata"
import {generateToken, hash, verify} from "./util/hash";

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;



const checkIfNotPopulated = async () => {
  try {
    let conversations = await Conversation.find()
    if (conversations.length > 0) {
      return;
    } else {
        let user = new User();
        let user2 = new User();
        let conversation = new Conversation();
        let conversation2 = new Conversation();
        let message = new ChatMessage();
        let message2 = new ChatMessage();
        user2.firstName = "Alex";
        user2.lastName = "Smith";
        user2.profileBackDropPath = "6.jpg";
        user2.username = "AlexSmith10";
        user2.password = await hash("Alex_Smith_password");
        user2.authToken = generateToken({firstName: user2.firstName, lastName: user2.lastName, id: user2.id});
        user.firstName = "John";
        user.lastName = "Doe";
        user.profileBackDropPath = "1.jpg";
        user.username = "JohnDoe10";
        user.password = await hash("John_Doe_password");
        user.authToken = generateToken({firstname: user.firstName, lastName: user.lastName, id: user.id});

        message.content = "Hi";
        message2.content = "Hello There";

        user.messages = [message];
        user.conversations = [conversation];
        user2.messages = [message2];
        user2.conversations = [conversation2];
        conversation2.messages = [message2];
        conversation2.users = [user2];
        conversation.messages = [message];
        conversation.users = [user];
        message2.user = user2;
        message2.conversation = conversation2;
        message.user = user;
        message.conversation = conversation;
        

        
        
        try {
          await User.save(user);
          await User.save(user2);
          await Conversation.save(conversation);
          await Conversation.save(conversation2);
          await ChatMessage.save(message);
          await ChatMessage.save(message2);
        } catch(e) {
          console.log(e)
        }
    }
  } catch(e) {
    console.log(e);
  }
}

const launch = async () => {

  await database.initialize();
  await checkIfNotPopulated();  
  await attachControllers(app, [AuthController, ChatController]);
  app.listen(port, () => {
    console.log(`The app is listening on port http://localhost:${port}`);
  })
}

launch();








