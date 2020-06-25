import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) {
    }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const access_token = request.headers['x-access-token']
        const result = await this.authService.getUser(access_token)
        
        if (result.code === 0) {
            return true
        } else {
            return false
        }
    }
}
