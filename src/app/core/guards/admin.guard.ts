import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, } from '@angular/router';
import { AuthService } from '@services/auth.service';
import {Location} from '@angular/common';
import { permission } from '@modules/permissions';

@Injectable({
  providedIn: 'root'
})
export class adminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate( next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    this.authService.checkUserAuth();
    let user = this.authService.getUserObj();
    let permission:any = user.permissions;

    const key = next.data['permissionKey'] ;
    if (!permission || (user.role!='admin' && !permission['all.manage'] && !permission[key])){
      // if (user.role!='admin'){
      this.router.navigate(['auth/login'])
        return false;
    }

    return true;
  }



}
