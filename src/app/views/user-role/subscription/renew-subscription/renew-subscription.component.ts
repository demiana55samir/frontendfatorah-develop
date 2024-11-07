import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { coupon } from '@modules/coupon';
import { features } from '@modules/landing';
import { subscription_plans } from '@modules/subscription-plans';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-renew-subscription',
  templateUrl: './renew-subscription.component.html',
  styleUrls: ['./renew-subscription.component.scss']
})
export class RenewSubscriptionComponent implements OnInit {
  private subs=new Subscription()
  // features!:features[]
  subscriptionPlanes!:subscription_plans[]
  monthly:boolean=true
  responsiveOptions:any
  language:string=''
  currentPlanId!:number
  addCouponForm!:FormGroup
  couponData:coupon={} as coupon

  constructor(private http:HttpService,
    private route:ActivatedRoute,private router:Router,
    private changelngServ:ChangeLanguageService,private fb:FormBuilder,private toastr:ToastrService) { 

      const queryParams = this.route.snapshot.queryParams;
      let paramString = '';
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          paramString += `${key}=${queryParams[key]}&`;
        }
      }
      // Remove the last '&' character
      paramString = paramString.slice(0, -1);
    
      if(paramString.length>0){
        this.subscribeFun(paramString)
      }
    }

  ngOnInit() {
    
    this.language=this.changelngServ.local_lenguage
    if(this.language == 'en'){
      this.monthly=false
    }
    this.addCouponForm=this.fb.group({
      coupon:['',Validators.required]
    })

    this.getLandingData()
    this.getDurations();
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {

    if (event.key === 'PrintScreen') {
      alert('Screenshots are disabled for this content!');
      event.preventDefault();
    }
  }
  subscribeFun(paramsString:string){
    // this.subs.add(this.http.getReq(`api/dashboard/subscriptions/callback?${paramsString}`).subscribe({
      // api/dashboard/subscriptions/2/3644/callbackMoyasr
    this.subs.add(this.http.getReq(`api/dashboard/subscriptions/callbackMoyasr?${paramsString}`).subscribe({
      next:res=>{
      
        this.toastr.success(res.message)
        // if(this.language=='ar'){
        //   this.toastr.success('.تم الاشتراك بنجاح')
        // }
        // else{
        //   this.toastr.success('You have successfully subscribed.')
        // }
        this.router.navigateByUrl('/user/Subscription/subscription-payment')
        // this.getGeneralData()
      },
      error:(err)=>{
        this.toastr.error(err.message)
        this.router.navigate(['/user/Subscription/change-plan'], {queryParams: {}});
        // this.toastr.clear();
        // if(this.language=='ar'){
        //   this.toastr.error('حدث خطأ اثناء الدفع')
        // }
        // else{
        //   this.toastr.error('An error occurred during payment.')
        // }
      }
    }))
  }

  @ViewChild('openAddCoupon') openAddCoupon!: ElementRef<HTMLElement>;
openAddCouponModel() {
  let el: HTMLElement = this.openAddCoupon.nativeElement;
    el.click();
}

  addCoupon(){
    if(this.addCouponForm.valid && this.addCouponForm.dirty){
      let body={
        'code':this.addCouponForm.controls['coupon'].value
      }
      let message=''
      this.subs.add(this.http.postReq('api/dashboard/subscriptions/voucher/redeem',body).subscribe({
        next:res=>{
          message=res?.message
          this.couponData=res?.data
        },
        complete:()=>{
         this.toastr.info(message)
         this.openAddCouponModel()
        },error:()=>{
          this.toastr.error(message)
        }
      }))
    }
    else{
      this.addCouponForm.markAllAsTouched()
    }

  }


  onTabChange(event: any, tabId: string): void {
    // this.owl = false;
    // setTimeout(() => {this.owl = true; },200)
  }


  features:features[] =[]
  durations:any = [];
  filteredDurations:any = [];
  getDurations(){
    this.subs.add(this.http.getReq('api/landing/durations').subscribe({
      next:res=>{
        this.durations=res.data
        this.filteredDurations = this.durations.filter((duration: any) => duration.plans_count > 0);
      },
      complete:()=>{
        if(this.filteredDurations.length > 0){
          this.currentDuration = this.filteredDurations[0].id;
        }

        this.getPlansByDuration(this.currentDuration);
      }
    }))
  }
  currentDuration = -1;
  chooseDurationFilter(durationId:number){
    this.currentDuration = durationId;
    this.getPlansByDuration(this.currentDuration);
  }

  getPlansByDuration(durationId:number){
    let param={
      duration_id:durationId
    }
    // /dashboard/userPlans
    this.subs.add(this.http.getReq(`api/dashboard/userPlans`,{params:param}).subscribe({
      next:res=>{
        this.subscriptionPlanes=this.NewmergePlansAndFeatures(res.packages,this.features);
      }
    }))
  }

  NewmergePlansAndFeatures(plans:subscription_plans[], features:any): subscription_plans[] {

    const subscriptionPlans: subscription_plans[] = plans.map((plan:any) => {
      const planFeatures: features[] = features.filter((feature:features) =>
      feature.plan_id==plan.id
      );
    //  alert(plan.id)
      return {
        id: plan?.id,
        name: plan?.name,
        description: plan?.description,
        price: plan?.price,
        full_price:plan?.full_price,
        currency:plan?.currency,
        yearly_price: plan?.yearly_price,
        monthly_full_price: plan?.monthly_full_price,
        yearly_full_price: plan?.yearly_full_price,
        durations:plan?.durations,
        trial_period:plan?.trial_period,
        features: planFeatures,
        plan_duration:plan?.durations?.name
      };
    });
  
    return subscriptionPlans;
  }

  getLandingData(){
    this.subs.add(this.http.getReq('api/landing').subscribe({
      next:res=>{
        this.features = res.data.features;
      }
    }))
  }
}
