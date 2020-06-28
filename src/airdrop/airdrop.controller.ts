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
    hash_tag: {
      field: 'hash_tag',
      type: 'string',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
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
  /* constructor(private readonly airdropService: AirdropService) {}


    @Get('/:cashtag')
    getAirdropDetail(@Param('cashtag') cashtag: string) {
        throw new NotImplementedException();
    }

    @Post('/:cashtag')
    claim(@Param('cashtag') cashtag: string) {
        // @todo: wait for matataki have a virtual account API to continue...
        throw new NotImplementedException();
    }

    @Put()
    createNewAirdrop(@Body() createAirdropDto: CreateAirdropDto) {
        // @todo: wait for matataki have a virtual account API to continue...
        const isCashtagAlreadyExist = false;
        if (isCashtagAlreadyExist) {
            throw new ConflictException(
                "Cashtag already exist, please try another cashtag or go random"
            );
        }
        console.log('createAirdropDto', createAirdropDto)
        // throw new NotImplementedException();
        return this.airdropService.create(createAirdropDto)
    } */
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
      return this.base.createOneBase(req, { ...dto, owner });
    } else {
      throw new BadRequestException();
    }
  }

  @UseGuards(AuthGuard)
  @Post('/:hash_tag')
  async claim(
    @Param('hash_tag') hash_tag: string,
    @Headers('x-access-token') accessToken: string,
    @Body() dto,
  ) {
    // 判断项目是否过期
    const isExpired = await this.service.isAirdropExpired(hash_tag);
    if (isExpired) {
      throw new BadRequestException('Airdrop Expired');
    }
    // to参数需要从accessToken中解出来
    const currentUser = await this.authService.getUser(accessToken);
    const to = currentUser.data.id;

    // 判断用户是否领取过
    const alreadyGet = await this.service.alreadyGetAirdrop(to, hash_tag);
    if (alreadyGet) {
      throw new BadRequestException('Already Claim Airdrop');
    }
    // 均分获取amount
    const amount = await this.service.getAirdropAmount(hash_tag);
    if (amount <= 0) {
      throw new BadRequestException('Airdrop Amount = 0');
    } else {
      const middleAccessToken = await this.authService.getAccessToken();
      console.log(middleAccessToken);
      const result = await this.service.claim(
        {
          ...dto,
          hash_tag,
          to,
          amount,
        },
        middleAccessToken.data,
      );
      return result;
    }
  }
}
