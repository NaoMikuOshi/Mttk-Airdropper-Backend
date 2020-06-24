import { Controller, Post, Body, Headers, Param, NotImplementedException, Get, Put, ConflictException, UseGuards, BadRequestException } from '@nestjs/common';
import { AirdropService } from './airdrop.service';
import { AuthService } from '../auth/auth.service';
import { CreateAirdropDto } from './dto/create-airdrop.dto';
import { AirdropList } from '../entities/AirdropList.entity'
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
      type: AirdropList,
    },
    routes: {
        only: ['getOneBase', 'getManyBase', 'createOneBase'],
    },
    params: {
        hash_tag: {
            field: 'hash_tag',  
            type: 'string',
            primary: true
        },
    },
    query: {
        alwaysPaginate: true
    }
})
@CrudAuth({
    property: 'user',
})
@Controller('airdrop')
export class AirdropController implements CrudController<AirdropList> {
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
    get base(): CrudController<AirdropList> {
        return this;
    }
    @UseGuards(AuthGuard)
    @Override()
    async createOne(
        @ParsedRequest() req: CrudRequest,
        @ParsedBody() dto: AirdropList,
        @Headers('x-access-token') accessToken: string,
    ) {
        console.log('testttttt', dto, accessToken);
        
        const result = await this.service.airdrop(dto, accessToken)
        if (result.code === 0) {
            return this.base.createOneBase(req, dto);
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
        // @todo: wait for matataki have a virtual account API to continue...
        // throw new NotImplementedException();
        console.log(dto);
        // todo: to参数需要从accessToken中解出来

        const to = 1042;
        const middleAccessToken = await this.authService.getAccessToken();
        const result = await this.service.claim({
            ...dto,
            hash_tag
        }, middleAccessToken)
        return result
    }

}
