import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress } from 'class-validator';

export class GetAbiDto {
  @ApiProperty({ name: 'address', required: true })
  @IsEthereumAddress()
  address: string;
}
