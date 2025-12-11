import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentencesService } from './sentences.service';
import { SentencesController } from './sentences.controller';
import { AudioService } from './audio.service';
import { UserSentence } from '../user-sentence.entity';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserSentence]), LoggerModule],
  controllers: [SentencesController],
  providers: [SentencesService, AudioService],
})
export class SentencesModule {}
