
import { Controller, Get, Req, Res, Post, Patch, Delete, Options } from "@decorators/express"
import { Request, Response } from "express";
import User from "../database/User";
import Conversation from "../database/Conversation";
import ChatMessage from "../database/ChatMessage";
import { Equal, Not, } from "typeorm";
import authMiddleware, { RequestWithUser } from "../middlewares/authMiddleware";
import { json } from "body-parser";

// @ts-ignore
@Controller("/chat", [authMiddleware])
export default class ChatController {

  @Get("/user")
  async getAllUsers(@Req() req: RequestWithUser, @Res() res: Response) {

    try {
      let users = await User.findBy(
        {
          id: Not(req.user.id)
        }
      );
      return res.json(users)
    } catch(e) {
      return res.status(401).json({
        message: "not found"
      })
    }
  }

  @Get("/:conversationId/message")
  async getAllMessages(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const id = Number(req.params.conversationId)
      let messages = await ChatMessage.findBy(
        {
          conversation: Equal(id)
        }
      )
      return  res.json(messages)
    } catch(e) {
      return res.status(404).json({
        message: "not found"
      })
    }
  }

  @Get("/:userId/message")
  async getAllMessagesOfUser(@Req() req: RequestWithUser, @Res() res: Response) {
    const userId = Number(req.params.userId)
    try {
          let userMessages = await ChatMessage.findBy(
        {
          user: Equal(userId)
        }
      );
      return res.json(userMessages);
    } catch(e) {
      return res.status(404).json({
        message: "not found"
      })
    }
  }

  @Patch("/:conversationId/me")
    async addUserToConversation(@Req() req: RequestWithUser, @Res() res: Response) {
        try {
            let id = Number(req.params.conversationId);
            let user = await User.findOneBy({
                id: req.user.id
            });

            

            let conversation = await Conversation.findOne(
                {
                  where: {
                    id: id 
                  },
                  relations: {
                    users: true
                  }
                }
            )
            if (conversation == null) {
                return res.status(404).json({
                    message: "something went wrong"
                })
            }
            let users = conversation.users;
            if (user != null) {
              users.push(user)
            }
            
            conversation.users = users;
            await Conversation.save(conversation);
            return res.json({
              conversation: conversation
            })

        } catch(e) {
          return res.status(404).json({
            message: "something went wrong"
          })
        }
    }

  @Get("/message/me")
  async getAllMessagesOfThisUser(@Req() req: RequestWithUser, @Res() res: Response) {
    const userId = req.user.id;
    try {
      let thisUserMessages = await ChatMessage.findBy(
        {
          user: Equal(userId)
        }
      )
      return res.json(thisUserMessages)
    } catch(e) {
      return res.status(404).json({
        message: "not found"
      })
    }
  }

  @Post("/:conversationId/message")
  async addMessage(@Req() req: RequestWithUser, @Res() res: Response) {
    let id = Number(req.params.conversationId);
    let conversation = await Conversation.findOneBy({id: id});
    let user = await User.findOneBy({id: req.body.user.id});
    if (conversation == null || user == null) {
      return res.status(404);
    }
    let trimmedContent = req.body.content.trim();
    if (trimmedContent == "") {
      return res.status(422).send();
    }
      let message = new ChatMessage();
      message.conversation = conversation;
      message.content = req.body.content;
      message.user = user;
      try {
        await ChatMessage.save(message);
        return res.json({
          ...message
        })
      } catch(e) {
        return res.status(401).json({
          message: "not found"
        })
      }
  }

  @Get("/conversation")
  async getAllConversations(@Req() req: RequestWithUser, @Res() res: Response) {
    const conversations = await Conversation.find({
      relations: {
        messages: true,
        users: true
      }
    }
    );
    return res.json({
      conversations: conversations
    })
  }
}