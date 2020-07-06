import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable()

export class IdentityGuard implements CanActivate{

    constructor(public router:Router,
                public userService: UserService){
    }

    canActivate(){
        let identity = this.userService.getIdentity();

        if(identity){
            return true;
        }else{
            this.router.navigate(['/']);
            return false;
        }    
    }

}