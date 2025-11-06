import { ApiProperty } from '@nestjs/swagger';

export class HelloResponseDto {
  @ApiProperty({
    description: 'Greeting message from the API',
    example: 'Hello World!',
  })
  message: string;
}
