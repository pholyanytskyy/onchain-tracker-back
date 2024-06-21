import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AbiService {
  constructor(private readonly httpService: HttpService) {}
  async findAbi(address: string) {
    try {
      const response = await this.httpService.axiosRef(
        `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`,
      );

      if (response.data.status === '0') {
        throw new BadRequestException(response.data.result);
      }

      return response.data.result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
