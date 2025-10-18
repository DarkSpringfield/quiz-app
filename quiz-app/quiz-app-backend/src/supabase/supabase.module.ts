import { Module } from '@nestjs/common'
import { SupabaseService } from './supabase.service'

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService], // exportieren für andere Module
})
export class SupabaseModule {}