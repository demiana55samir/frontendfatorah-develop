import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, CanLoad, Router, } from '@angular/router';
import { AuthService } from '@services/auth.service';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminSupportGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    this.authService.checkUserAuth();
    let user = this.authService.getUserObj();
    
    if (user.role!='support' && user.role!='admin' ){
      this.router.navigate(['auth/login'])
        return false;
    }

    return true;
  }



}
