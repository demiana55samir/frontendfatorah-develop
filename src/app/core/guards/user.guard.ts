import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, CanLoad, Router, } from '@angular/router';
import { AuthService } from '@services/auth.service';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class userGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  canActivate(): boolean {
    this.authService.checkUserAuth();
    let user = this.authService.getUserObj();
    
    if (user.role!='user'){
      this.router.navigate(['auth/login'])
        return false;
    }

    return true;
  }



}
