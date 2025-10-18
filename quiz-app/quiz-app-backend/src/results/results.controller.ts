import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
    constructor(private readonly resultsService: ResultsService) {}

    @Post()
    create(@Body() result: any) {
        return this.resultsService.create(result);
    }

    @Get()
    async find(@Query('username') username?: string) {
        if(username) {
            return this.resultsService.findByUsername(username);
        }
        return this.resultsService.findAll;
    }
}
