import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content!: string;

  @ApiProperty({ description: 'Whether this is an official response', default: false })
  @IsBoolean()
  @IsOptional()
  isOfficialResponse?: boolean;
} 