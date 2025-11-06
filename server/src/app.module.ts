import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SentencesModule } from './sentences/sentences.module';
import { LoggerModule } from './logger/logger.module';
import { User } from './user.entity';
import { UserSentence } from './user-sentence.entity';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'dictate_english',
      entities: [User, UserSentence],
      synchronize: true,
    }),
    AuthModule,
    SentencesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
