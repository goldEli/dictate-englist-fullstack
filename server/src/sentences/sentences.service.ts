import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { UserSentence } from '../user-sentence.entity';
import {
  CreateSentenceDto,
  UpdateSentenceDto,
  ReorderSentencesDto,
} from '../auth/dto/sentence.dto';
import { AppLogger } from '../logger/logger.service';
import { AudioService } from './audio.service';

@Injectable()
export class SentencesService {
  private redis: Redis.default;

  constructor(
    @InjectRepository(UserSentence)
    private sentencesRepository: Repository<UserSentence>,
    private readonly logger: AppLogger,
    private readonly audioService: AudioService,
  ) {
    this.redis = new Redis.default({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
    });
    this.logger.setContext('SentencesService');
  }

  private async getUserIdFromToken(token: string): Promise<number> {
    try {
      const sessionData = await this.redis.get(`session:${token}`);

      if (!sessionData) {
        throw new UnauthorizedException('Invalid or expired session');
      }

      const session = JSON.parse(sessionData);
      return session.userId;
    } catch (error) {
      this.logger.error(
        'Token validation failed',
        error.stack,
        'getUserIdFromToken',
      );
      throw new UnauthorizedException('Invalid session');
    }
  }

  async getSentences(token: string) {
    try {
      const userId = await this.getUserIdFromToken(token);
      this.logger.debug(
        `Getting sentences for userId=${userId}`,
        'getSentences',
      );

      const sentences = await this.sentencesRepository.find({
        where: { user_id: userId },
        order: { sentence_order: 'ASC' },
      });

      const formattedSentences = sentences.map((s) => ({
        id: s.sentence_id,
        text: s.sentence_text,
        audioUrl: s.audio_url,
      }));

      this.logger.log(
        `Retrieved ${sentences.length} sentences for userId=${userId}`,
        'getSentences',
      );

      return {
        success: true,
        sentences: formattedSentences,
      };
    } catch (error) {
      this.logger.error('Failed to get sentences', error.stack, 'getSentences');
      throw error;
    }
  }

  async createSentence(token: string, createSentenceDto: CreateSentenceDto) {
    try {
      const userId = await this.getUserIdFromToken(token);
      this.logger.debug(
        `Creating sentence for userId=${userId}`,
        'createSentence',
      );

      const existingCount = await this.sentencesRepository.count({
        where: { user_id: userId },
      });

      // 生成音频文件
      const audioUrl = await this.audioService.generateAudio(createSentenceDto.text);

      const userSentence = this.sentencesRepository.create({
        user_id: userId,
        sentence_id: uuidv4(),
        sentence_text: createSentenceDto.text,
        sentence_order: existingCount,
        audio_url: audioUrl,
      });

      await this.sentencesRepository.save(userSentence);

      this.logger.log(
        `Created sentence for userId=${userId} with audio`,
        'createSentence',
      );

      return {
        success: true,
        sentence: {
          id: userSentence.sentence_id,
          text: userSentence.sentence_text,
          audioUrl: userSentence.audio_url,
        },
      };
    } catch (error) {
      this.logger.error(
        'Failed to create sentence',
        error.stack,
        'createSentence',
      );
      throw error;
    }
  }

  async updateSentence(
    token: string,
    sentenceId: string,
    updateSentenceDto: UpdateSentenceDto,
  ) {
    try {
      const userId = await this.getUserIdFromToken(token);
      this.logger.debug(
        `Updating sentence for userId=${userId}`,
        'updateSentence',
      );

      const userSentence = await this.sentencesRepository.findOne({
        where: { user_id: userId, sentence_id: sentenceId },
      });

      if (!userSentence) {
        throw new NotFoundException('Sentence not found');
      }

      userSentence.sentence_text = updateSentenceDto.text;
      await this.sentencesRepository.save(userSentence);

      this.logger.log(
        `Updated sentence for userId=${userId}`,
        'updateSentence',
      );

      return {
        success: true,
        sentence: {
          id: userSentence.sentence_id,
          text: userSentence.sentence_text,
        },
      };
    } catch (error) {
      this.logger.error(
        'Failed to update sentence',
        error.stack,
        'updateSentence',
      );
      throw error;
    }
  }

  async deleteSentence(token: string, sentenceId: string) {
    try {
      const userId = await this.getUserIdFromToken(token);
      this.logger.debug(
        `Deleting sentence for userId=${userId}`,
        'deleteSentence',
      );

      const userSentence = await this.sentencesRepository.findOne({
        where: { user_id: userId, sentence_id: sentenceId },
      });

      if (!userSentence) {
        throw new NotFoundException('Sentence not found');
      }

      await this.sentencesRepository.remove(userSentence);

      this.logger.log(
        `Deleted sentence for userId=${userId}`,
        'deleteSentence',
      );

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(
        'Failed to delete sentence',
        error.stack,
        'deleteSentence',
      );
      throw error;
    }
  }

  async reorderSentences(
    token: string,
    reorderSentencesDto: ReorderSentencesDto,
  ) {
    try {
      const userId = await this.getUserIdFromToken(token);
      this.logger.debug(
        `Reordering sentences for userId=${userId}`,
        'reorderSentences',
      );

      const sentences = reorderSentencesDto.sentences;

      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        await this.sentencesRepository.update(
          { user_id: userId, sentence_id: sentence.id },
          { sentence_order: i },
        );
      }

      this.logger.log(
        `Reordered ${sentences.length} sentences for userId=${userId}`,
        'reorderSentences',
      );

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(
        'Failed to reorder sentences',
        error.stack,
        'reorderSentences',
      );
      throw error;
    }
  }
}
