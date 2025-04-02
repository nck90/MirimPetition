import { IsString, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PetitionCategory } from '../../entities/petition.entity';

export class CreatePetitionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content!: string;

  @ApiProperty({ enum: PetitionCategory })
  @IsEnum(PetitionCategory)
  @IsNotEmpty()
  category!: PetitionCategory;
} 