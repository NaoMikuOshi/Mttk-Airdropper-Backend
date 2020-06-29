import {
  Controller,
  Post,
  Body,
  Headers,
  Param,
  NotImplementedException,
  Get,
  Put,
  ConflictException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AirdropService } from './airdrop.service';
import { AuthService } from '../auth/auth.service';
import { CreateAirdropDto } from './dto/create-airdrop.dto';
import { AirdropEvent } from '../entities/AirdropEvent.entity';
import {
  Crud,
  CrudController,
  Override,
  CrudRequest,
  ParsedRequest,
  ParsedBody,
  CrudAuth,
} from '@nestjsx/crud';
// import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../auth/guards/auth.guard';

// @todo: wait for matataki have a virtual account API to continue...
@Crud({
  model: {
    type: AirdropEvent,
  },
  routes: {
    only: ['getOneBase', 'getManyBase', 'createOneBase'],
  },
  params: {
    cashtag: {
      field: 'cashtag',
      type: 'string',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      claimLogs: {
        eager: true,
      },
    },
  },
})
@CrudAuth({
  property: 'user',
})
@Controller('airdrop')
export class AirdropController implements CrudController<AirdropEvent> {
  constructor(
    public service: AirdropService,
    public authService: AuthService,
  ) {}
  get base(): CrudController<AirdropEvent> {
    return this;
  }
  @UseGuards(AuthGuard)
  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto,
    @Headers('x-access-token') accessToken: string,
  ) {
    const balance = await this.service.balance(dto.tokenId, accessToken);
    if (balance.code != 0 || balance.data <= 0) {
      throw new BadRequestException('token not exist or balance = 0');
    }
    // to参数需要从accessToken中解出来
    const currentUser = await this.authService.getUser(accessToken);
    const owner = currentUser.data.id;
    const result = await this.service.airdrop(dto, accessToken);
    if (result.code === 0) {
      return this.base.createOneBase(req, { ...dto, type: 'equal', owner });
    } else {
      throw new BadRequestException();
    }
  }

  @UseGuards(AuthGuard)
  @Post('/:cashtag')
  async claim(
    @Param('cashtag') cashtag: string,
    @Headers('x-access-token') accessToken: string,
    @Body() dto,
  ) {
    // 判断项目是否过期
    const isExpired = await this.service.isAirdropExpired(cashtag);
    if (isExpired) {
      throw new BadRequestException('Airdrop Expired');
    }
    // to参数需要从accessToken中解出来
    const currentUser = await this.authService.getUser(accessToken);
    const to = currentUser.data.id;

    // 判断用户是否领取过
    const alreadyGet = await this.service.alreadyGetAirdrop(to, cashtag);
    if (alreadyGet) {
      throw new BadRequestException('Already Claim Airdrop');
    }
    // 均分获取amount
    const amount = await this.service.getAirdropAmount(cashtag);
    if (amount <= 0) {
      throw new BadRequestException('Airdrop Amount = 0');
    } else {
      // const middleAccessToken = await this.authService.getAccessToken();
      // console.log(middleAccessToken);
      const result = await this.service.claim(
        {
          ...dto,
          cashtag,
          to,
          amount,
        },
        // middleAccessToken.data,
      );
      return result;
    }
  }
}
