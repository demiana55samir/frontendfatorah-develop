import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, CanLoad, Router, } from '@angular/router';
import { AuthService } from '@services/auth.service';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class loginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  canActivate(): boolean {
    this.authService.checkUserAuth();
    let user = this.authService.getUser();

    if (this.authService.isUserAuth() && this.authService.getUserObj().verified_at && this.authService.getUserObj().account_name){
      if(user.role=='user'){
        this.router.navigate(['/user/control/dashboard'])
      }
      else{
        this.router.navigate(['/admin/control/dashboard'])
      }
        return false;
    }
    return true;
  }

//   canLoad(): boolean {
//     this.authService.checkUserAuth();
//     let user = this.authService.getUser();

//     if (this.authService.isUserAuth()) {
//       if(user.role[0] == 1){
//         return true;
//       }
      
//       this.router.navigate(['Home']);
//       return false;
//     }

//     this.router.navigate(['employee/employeeLogin']);
//     return false;
//   }

}
