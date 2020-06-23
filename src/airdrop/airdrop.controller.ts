import { Controller, Post, Body, Param, NotImplementedException, Get, Put, ConflictException } from '@nestjs/common';
import { AirdropService } from './airdrop.service';
import { CreateAirdropDto } from './dto/create-airdrop.dto';

// @todo: wait for matataki have a virtual account API to continue...
@Controller('airdrop')
export class AirdropController {
    constructor(private readonly airdropService: AirdropService) {}


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
    }
}
