import {
  HttpService,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return false;
  }

  async login(user: any) {}
  async getAccessToken(): Promise<any> {
    const { TEMP_ACCOUNT, TEMP_PASSWORD } = process.env;
    return this.httpService
      .post('/login/account', {
        username: TEMP_ACCOUNT,
        password: TEMP_PASSWORD,
      })
      .toPromise()
      .then((res) => res.data);
  }
  async getUser(access_token: string): Promise<any> {
    return this.httpService
      .get('/user/stats', {
        headers: {
          'x-access-token': access_token,
        },
      })
      .toPromise()
      .then((res) => res.data);
  }
}
