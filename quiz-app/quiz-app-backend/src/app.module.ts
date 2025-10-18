import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';
import { QuestionsController } from './questions/questions.controller';
import { QuestionsService } from './questions/questions.service';
import { ResultsModule } from './results/results.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [QuestionsModule, ResultsModule, SupabaseModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, QuestionsController],
  providers: [AppService, QuestionsService],
})
export class AppModule {}
