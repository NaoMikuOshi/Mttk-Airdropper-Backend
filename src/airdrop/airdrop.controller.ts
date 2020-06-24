import { Controller, Post, Body, Headers, Param, NotImplementedException, Get, Put, ConflictException, UseGuards } from '@nestjs/common';
import { AirdropService } from './airdrop.service';
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
    constructor(public service: AirdropService) {}
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
    createOne(
        @ParsedRequest() req: CrudRequest,
        @ParsedBody() dto: AirdropList,
    ) {
        return this.base.createOneBase(req, dto);
    }
    @Post('/:cash_tag')
    async claim(
        @Param('cash_tag') cash_tag: string,
        @Headers('x-access-token') accessToken: string,
        @Body() dto,
    ) {
        // @todo: wait for matataki have a virtual account API to continue...
        // throw new NotImplementedException();
        console.log(dto);
        
        const result = await this.service.transfer(dto, accessToken)
        return result
    }

}
