import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ResultsService {
    constructor(private supabase: SupabaseService) {}

    async create(result: any) {
        const { data, error } = await this.supabase.client.from('results').insert([result]).select();
        if(error) {
            throw error;
        }
        return data;
    }
    
    async findByUsername(username: string) {
        const { data, error } = await this.supabase.client 
            .from('results')
            .select('*')
            .eq('username', username)
            .order('id', {ascending: false});

        if(error) {
            throw error;
        }
        return data;
    }

    async findAll() {
        const { data, error } = await this.supabase.client.from('results').select('*');
        if(error) {
            throw error;
        }
        return data; 
    }
}
