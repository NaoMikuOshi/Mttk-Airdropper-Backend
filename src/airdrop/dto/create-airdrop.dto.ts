import {
  IsInt,
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsIn,
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
}
