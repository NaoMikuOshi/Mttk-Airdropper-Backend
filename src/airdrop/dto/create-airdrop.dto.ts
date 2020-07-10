import {
  IsInt,
  IsString,
  IsNumber,
  IsIn,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateAirdropDto {
  @IsString()
  readonly title: string;

  @IsInt()
  readonly tokenId: number;

  @IsInt()
  readonly quantity: number;

  @IsNumber()
  readonly amount: number;

  @IsIn(['random', 'equal'])
  readonly type: 'random' | 'equal';

  @IsString()
  @IsOptional()
  @MinLength(5, {
    message: 'Cashtag is too short',
  })
  @MaxLength(20, {
    message: 'Cashtag is too long',
  })
  readonly cashtag?: string;
}
