import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HelloResponseDto } from './dto/hello-response.dto';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns greeting message',
    type: HelloResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getHello(): HelloResponseDto {
    return { message: this.appService.getHello() };
  }
}
