import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PetitionStatus, PetitionCategory } from '../../entities/petition.entity';

export class QueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ required: false, enum: PetitionCategory })
  @IsOptional()
  @IsEnum(PetitionCategory)
  category?: PetitionCategory;

  @ApiProperty({ required: false, enum: PetitionStatus })
  @IsOptional()
  @IsEnum(PetitionStatus)
  status?: PetitionStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orderBy?: string;
} 