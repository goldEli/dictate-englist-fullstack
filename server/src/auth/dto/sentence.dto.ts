import { ApiProperty } from '@nestjs/swagger';

export class CreateSentenceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;
}

export class UpdateSentenceDto {
  @ApiProperty()
  text: string;
}

export class ReorderSentencesDto {
  @ApiProperty({ type: [CreateSentenceDto] })
  sentences: CreateSentenceDto[];
}
