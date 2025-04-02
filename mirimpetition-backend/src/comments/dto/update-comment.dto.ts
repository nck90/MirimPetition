import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ description: 'Whether this is an official response', default: false })
  @IsBoolean()
  @IsOptional()
  isOfficialResponse?: boolean;

  constructor(partial: Partial<UpdateCommentDto>) {
    Object.assign(this, partial);
  }
} 