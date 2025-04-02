import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum VoteType {
  AGREE = 'AGREE',
  DISAGREE = 'DISAGREE',
  NEUTRAL = 'NEUTRAL',
}

export class CreateVoteDto {
  @ApiProperty({
    enum: VoteType,
    description: 'The type of vote',
    example: VoteType.AGREE,
  })
  @IsEnum(VoteType)
  type!: VoteType;
} 