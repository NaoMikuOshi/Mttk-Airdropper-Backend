import { IsInt, IsString, IsNumber, IsDate } from 'class-validator';

export class CreateAirdropDto {
  @IsString()
  readonly title: string;

  @IsInt()
  readonly tokenId: number;

  @IsInt()
  readonly quantity: number;

  @IsNumber()
  readonly amount: number;
}
