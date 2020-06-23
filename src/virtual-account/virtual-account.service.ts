import { HttpService, Injectable, NotImplementedException } from '@nestjs/common';
import { of, Observable } from 'rxjs'
import { catchError, map, timeout } from 'rxjs/operators'

@Injectable()
export class VirtualAccountService {
    constructor(private readonly httpService: HttpService) {
    }
    create(owner) {
        throw new NotImplementedException();
    }

    deposit() {

    }
    getAccessToken(): Observable<any> {
        const { TEMP_ACCOUNT, TEMP_PASSWORD } = process.env;
        return this.httpService
        .post('/login/account', {
            username: TEMP_ACCOUNT,
            password: TEMP_PASSWORD
        }).pipe(
            map(res => res.data.data),
            catchError(error => of(`Bad Promise: ${error}`))
        )
    }    
}
