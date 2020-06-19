import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class VirtualAccountService {
    create(owner) {
        throw new NotImplementedException();
    }

    deposit() {

    }

    
}
