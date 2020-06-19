import { Controller, Post, Param, NotImplementedException, Get, Put, ConflictException } from '@nestjs/common';

// @todo: wait for matataki have a virtual account API to continue...
@Controller('airdrop')
export class AirdropController {

    @Get('/:cashtag')
    getAirdropDetail(@Param('cashtag') cashtag: string) {
        throw new NotImplementedException();
    }

    @Post('/:cashtag')
    claim(@Param('cashtag') cashtag: string) {
        // @todo: wait for matataki have a virtual account API to continue...
        throw new NotImplementedException();
    }

    @Put('/:cashtag')
    createNewAirdrop(@Param('cashtag') cashtag: string) {
        // @todo: wait for matataki have a virtual account API to continue...
        const isCashtagAlreadyExist = false;
        if (isCashtagAlreadyExist) {
            throw new ConflictException(
                "Cashtag already exist, please try another cashtag or go random"
            );
        }
        throw new NotImplementedException();
    }
}
