import {
  Controller,
  Post,
  Body,
  Headers,
  Param,
  Get,
  UseGuards,
  BadRequestException,
  ConflictException,
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
    @ParsedBody() dto: CreateAirdropDto,
    @Headers('x-access-token') accessToken: string,
  ) {
    const isCashtagExist = await this.service.isExist(dto.cashtag);
    if (isCashtagExist)
      throw new ConflictException(
        'Cashtag already exist, please try another one.',
      );
    const balance = await this.service.balance(dto.tokenId, accessToken);
    if (balance.code !== 0 || balance.data <= 0)
      throw new BadRequestException('token not exist or balance = 0');
    // to参数需要从accessToken中解出来
    const currentUser = await this.authService.getUser(accessToken);
    const owner = currentUser.data.id;
    const result = await this.service.airdrop(dto, accessToken);
    if (result.code === 0) {
      return this.service.createAirdrop(dto, owner);
    } else {
      throw new BadRequestException();
    }
  }

  @Get('/:cashtag/isClaimed')
  async checkIsClaimed(
    @Param('cashtag') cashtag: string,
    @Headers('x-access-token') accessToken?: string,
  ) {
    if (!accessToken) return { isClaimed: false }; // I do not know if you are not logined
    const currentUser = await this.authService.getUser(accessToken);
    const claimResult = await this.service.getClaimLogForUser(
      currentUser.data.id,
      cashtag,
    );
    return { isClaimed: Boolean(claimResult), claimResult };
  }

  @UseGuards(AuthGuard)
  @Post('/:cashtag')
  async claim(
    @Param('cashtag') cashtag: string,
    @Headers('x-access-token') accessToken: string,
    @Body() dto,
  ) {
    // Check if airdrop finished
    const isAirDropFinished = await this.service.isAirDropFinished(cashtag);
    if (isAirDropFinished) throw new BadRequestException('Airdrop Finished');

    // to参数需要从accessToken中解出来
    const currentUser = await this.authService.getUser(accessToken);
    const to = currentUser.data.id as number;

    // 判断用户是否领取过
    const alreadyGet = await this.service.alreadyGetAirdrop(to, cashtag);
    if (alreadyGet)
      throw new BadRequestException('You already claimed this Airdrop');

    return this.service.handleClaimAirdrop(cashtag, to);
  }
}
