import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionService: QuestionsService) {}

    @Get()
    findAll() {
        return this.questionService.findAll();
    }

    @Post()
    create(@Body() question: any) {
        return this.questionService.create(question);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() question: any) {
        return this.questionService.update(id, question);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.questionService.delete(id);
    }
}
