import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { SentencesService } from './sentences.service';
import { CreateSentenceDto, UpdateSentenceDto, ReorderSentencesDto } from '../auth/dto/sentence.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('sentences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sentences')
export class SentencesController {
  constructor(private readonly sentencesService: SentencesService) {}

  @Get()
  async getSentences(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.sentencesService.getSentences(token);
  }

  @Post()
  async createSentence(
    @Headers('authorization') authHeader: string,
    @Body() createSentenceDto: CreateSentenceDto,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.sentencesService.createSentence(token, createSentenceDto);
  }

  @Put(':id')
  async updateSentence(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() updateSentenceDto: UpdateSentenceDto,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.sentencesService.updateSentence(token, id, updateSentenceDto);
  }

  @Delete(':id')
  async deleteSentence(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.sentencesService.deleteSentence(token, id);
  }

  @Put('reorder')
  async reorderSentences(
    @Headers('authorization') authHeader: string,
    @Body() reorderSentencesDto: ReorderSentencesDto,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.sentencesService.reorderSentences(token, reorderSentencesDto);
  }
}
