import { Module } from '@nestjs/common';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [ResultsController],
  providers: [ResultsService, SupabaseService],
})
export class ResultsModule {}
