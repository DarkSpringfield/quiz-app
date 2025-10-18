import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';


@Injectable()
export class QuestionsService {
    constructor(private supabase: SupabaseService) {}

    async findAll() {
        const { data, error} = await this.supabase.client.from('questions').select('*');
        if(error) {
            throw error;
        }
        return data;
    }

    async create(question: any) {
        const { data, error } = await this.supabase.client.from('questions').insert([question]).select();
        if(error) {
            throw error;
        }
        return data;
    }

    async update(id: number, question: any) {
        const { data, error } = await this.supabase.client.from('questions').update(question).eq('id', id).select();
        if(error) {
            throw error;
        }
        return data;
    }

    async delete(id: number) {
        const { data, error } = await this.supabase.client.from('questions').delete().eq('id', id).select();
        if(error) {
            throw error;
        }
        return data;
    }
}
