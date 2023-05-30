
import { Controller, Get, Req, Res, Post, Patch, Delete, Options } from "@decorators/express"
import { Request, Response } from "express";
import { ChatMessage, User } from "../database/chat";
import { Equal } from "typeorm";


@Controller("/chat")
class ChatController {

  @Get("/")
  typeSomeResponse(@Res() res: Response) {
    res.json("Wroking");
  }

  @Get("/user")
  async getAllUsers(@Res() res: Response) {
    try {
      let users = await User.find();
      res.json(users)
    } catch(e) {
      console.log(e)
    }
  }

  @Get("/message")
  async getAllMessages(@Res() res: Response) {
    try {
      let messages = await ChatMessage.find()
      res.json(messages)
    } catch(e) {
      console.log(e)
    }
  }

  @Get("/message/:userId")
  async getAllMessagesOfUser(@Req() req: Request, @Res() res: Response) {
    const userId = Number(req.params.userId)
    try {
          let userMessages = await ChatMessage.findBy(
        {
          userId: Equal(userId)
        }
      );
      res.json(userMessages);
    } catch(e) {
      res.status(404)
      console.log(e)
    }
  }

  @Post("/message")
  async addMessage(@Req() req: Request, @Res() res: Response) {
      let message = new ChatMessage()
      message.userId = req.body.userId;
      message.content = req.body.content;
      message.toUserId = req.body.toUserId;
      try {
        await ChatMessage.save(message);
        res.json({
          success: true
        })
      } catch(e) {
        console.log(e)
      }
  }

  @Delete("/message/:id")
  async deleteMessage(@Req() req: Request, @Res() res: Response) {
    try {
      const numberId = Number(req.params.id);
      let toDelete = await ChatMessage.findOneBy(
        {
            id: Equal(numberId),
        }
      );
      if (toDelete == null) {
        return res.status(404);
      }
      await ChatMessage.remove(toDelete);
      return res.json({
        success: true
      })
    } catch(e) {
        return res.status(404);
    }
  }

  @Patch("/message/:id")
  async updateMessage(@Req() req: Request, @Res() res: Response) {
    try {
      const numberId = Number(req.params.id);
      let toEdit = await ChatMessage.findOneBy(
        {
          id: Equal(numberId)
        }
      );
      if (toEdit == null) {
        return res.status(404);
      }
      toEdit.content = req.body.content;
      await ChatMessage.save(toEdit);
      return res.json({
        seccess: true
      })
    } catch(e) {
      return res.status(404);
    }
  }
}

export default ChatController;