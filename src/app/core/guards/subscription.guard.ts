import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, CanLoad, Router, } from '@angular/router';
import { AuthService } from '@services/auth.service';
import {Location} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { Subscription } from 'rxjs';
import { HttpService } from '@services/http.service';
import { SubscriptionDataService } from '@services/subscription-data.service';
import { subscriptionData } from '@models/userSubscriptioData';

@Injectable({
  providedIn: 'root'
})
export class subscriptionGuard implements CanActivate {
    language:any
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private toastr:ToastrService,
    private lang:ChangeLanguageService,
    private http:HttpService,
    private userSubscription:SubscriptionDataService
  ) { 
    this.language=lang.local_lenguage
  }

  canActivate(): boolean {
    // this.authService.checkUserAuth();
    // let user = this.authService.getUserObj();
    // if (user.remaining_invoices!='UNLIMITED'){
    //   let subscriptionData:subscriptionData=this.userSubscription.GetUserSubscriptionData()
    //   console.log(subscriptionData)
    //    if(subscriptionData.invoices==0){
    //      if(this.language=='ar'){
    //          this.toastr.error('لقد تخطيت عدد الفواتير المتاحه لك')
    //      }
    //      else{
    //          this.toastr.error('You have exceeded the number of invoices available to you')
    //      }
    //    }
    //     return false;
    // }

    return true;
  }

  checkRemainingInvoices(){

  }



}
