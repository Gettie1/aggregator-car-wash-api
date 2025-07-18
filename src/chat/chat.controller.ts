import { Body, Controller, Header, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @Public()
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  async create(
    @Body() createChatDto: CreateChatDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.chatService.handleRequest(createChatDto, res);
  }
}
