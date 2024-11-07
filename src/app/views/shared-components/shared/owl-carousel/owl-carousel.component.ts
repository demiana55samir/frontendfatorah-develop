import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { coupon } from '@modules/coupon';
import { features } from '@modules/landing';
import { subscription_plans } from '@modules/subscription-plans';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { PaymentService } from '@services/payment.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-owl-carousel',
  templateUrl: './owl-carousel.component.html',
  styleUrls: ['./owl-carousel.component.scss']
})
export class OwlCarouselComponent implements OnInit ,OnChanges {
  @Input() monthly!:boolean
  @Input() couponData!: coupon  ;

  @Input() subscriptionPlanes!:subscription_plans[];

  private subs=new Subscription()
  // features!:features[]
  // subscriptionPlanes!:subscription_plans[]
  // monthly:boolean=true
  responsiveOptions:any
  language:string=''
  currentPlanId!:number
  currentDurationId:string = '';

  validCouponMonthly:boolean=false
  validCouponYearly:boolean=false

  customOptions: OwlOptions = {
    // loop: false,
    // autoplay: false,
    // mouseDrag: false,
    // touchDrag: true,
    // pullDrag: false,
    // dots: false,
    // navSpeed: 70,
    // nav: true,
    // center:false,
    // margin: 10,
    // autoWidth:true,
    
    loop: false,
    nav: true,
    navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'], // Left and Right arrow icons
    items: 1,
    dots: false,
    autoplay: false,




  responsive: {
    0: {
      items: 1,
    },
    450: {
      items: 1,
    },
    675: {
      items: 1,
    },
    900:{
      items:3
    }
  },
  };
owl = true;
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.owl = false;
    setTimeout(() => {
      this.owl = true
      if(this.subscriptionPlanes.length > 8){
         this.customOptions.items = 8;
         this.customOptions.responsive= {
          0: {
            items: 1,
          },
          450: {
            items: 1,
          },
          675: {
            items: 1,
          },
          900:{
            items:6
          },
          1100:{
            items:8
          }
        }
        }
      else {
        this.customOptions.items = this.subscriptionPlanes.length;
        this.customOptions.responsive= {
          0: {
            items: 1,
          },
          450: {
            items: 1,
          },
          675: {
            items: 1,
          },
          900:{
            items:3
          },
          1100:{
            items:3
          }
        }}
    }, 200);
  }
  UserObj:any
  validCouponAll=true

  constructor(private http:HttpService,
    private changelngServ:ChangeLanguageService,
    private toastr:ToastrService,
    private paymentService:PaymentService,
    private router:Router) { }
  ngOnChanges(changes: SimpleChanges): void {

    if(changes['subscriptionPlanes']){
      // console.log(this.subscriptionPlanes);
      
    }
   if(this.couponData?.subscription=='monthly'){
    this.validCouponMonthly=true
    this.validCouponYearly=false
   }
   else if(this.couponData?.subscription=='yearly'){
    this.validCouponYearly=true
    this.validCouponMonthly=false

   }
   else if(this.couponData?.subscription=='all'){
    this.validCouponMonthly=false
    this.validCouponYearly=false
    this.validCouponAll=true
   }
   else{
    this.validCouponMonthly=false
    this.validCouponYearly=false
   }

  }

  ngOnInit() {
    // this.validCoupon=true
    this.language=this.changelngServ.local_lenguage

    this.UserObj=localStorage.getItem('UserObj')
    this.UserObj=JSON.parse(this.UserObj)
    this.currentPlanId=this.UserObj?.plan?.id
    this.currentDurationId = this.UserObj?.current_duration_id;
    this.language=this.changelngServ.local_lenguage
    if(this.language === 'ar'){
      this.customOptions.rtl=true
    }
    else{
      this.customOptions.rtl=false
    }

  // this.getLandingData()
  this.getGeneralData()
  }

  getLandingData(){
    this.subs.add(this.http.getReq('api/landing').subscribe({
      next:res=>{
      this.subscriptionPlanes=this.mergePlansAndFeatures(res.data)
      }
    }))
  }

  mergePlansAndFeatures(apiResponse: any): subscription_plans[] {
    const { plans, features } = apiResponse;
  
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
        trial_period:plan?.trial_period,
        features: planFeatures,
        plan_duration:plan?.durations?.name
      };
    });

    return subscriptionPlans;
  }
  payment_link:string=''
  renewSubscription(plan_id:number,subscription_type:string , freeTrial:number,durationID:number){
    let params={
      'duration_id':durationID,
      'subscription_type':subscription_type,
      'with_trial': freeTrial
    }
    this.subs.add(this.http.getReq(`api/dashboard/subscriptions/${plan_id}/subscribe`,{params:params}).subscribe({
      next:res=>{
        this.payment_link=res.data;
        if(res?.status == 'trial'){
          this.toastr.success(res?.message)
          this.router.navigate(['/user/Subscription/subscription-payment'])
        }
       else if(res?.status == 'subscribe'){
        window.open(this.payment_link, '_blank');
      }
      },complete:()=> {
      }
    }))
  }

  initiateSubscription(amount:number,description:string,plan_id:number,plane_index:number,currency?:string){
    if(this.couponData.id){
      this.paymentService.set_amount(this.checkPlanDetails(plan_id,plane_index))
    }
    else{
      this.paymentService.set_amount(amount)
    }
    this.paymentService.set_description(description)
    this.paymentService.set_plane_id(plan_id)

    this.router.navigate(['/user/Subscription/make-payment'])
    

  }
  checkPlanDetails(plan_id:number,plan_index:number){
    let discountValue=-1
    let monthlyValue=''
    if(this.language=='ar'){
      if(this.monthly){
        monthlyValue='monthly'
      }
      else{
        monthlyValue='yearly'
      }
    }
    else{
      if(this.monthly){
        monthlyValue='yearly'
      }
      else{
        monthlyValue='monthly'
      }
    }
    
    if(this.couponData.subscription==monthlyValue || this.couponData.subscription=='all'){
      if(this.couponData.plan_id==plan_id||String(this.couponData.plan_id)==''){
        if(this.couponData.type=='percentage'){
         if(this.monthly &&this.language=='ar' || !this.monthly && this.language=='en'){
           discountValue=this.subscriptionPlanes[plan_index].price - (this.subscriptionPlanes[plan_index].price*(this.couponData.discount/100)) > 0 ? this.subscriptionPlanes[plan_index].price - (this.subscriptionPlanes[plan_index].price*(this.couponData.discount/100)) : 0
         }
         else{
          discountValue=this.subscriptionPlanes[plan_index].yearly_price - (this.subscriptionPlanes[plan_index].yearly_price*(this.couponData.discount/100)) > 0 ? this.subscriptionPlanes[plan_index].yearly_price - (this.subscriptionPlanes[plan_index].yearly_price*(this.couponData.discount/100)) : 0
         }
        }
        else{
          if(this.monthly &&this.language=='ar' || !this.monthly && this.language=='en'){
            discountValue= this.subscriptionPlanes[plan_index].price - this.couponData.discount >0 ? this.subscriptionPlanes[plan_index].price - this.couponData.discount : 0
          }
          else{
            discountValue= this.subscriptionPlanes[plan_index]?.yearly_price - this.couponData.discount >0 ? this.subscriptionPlanes[plan_index]?.yearly_price - this.couponData.discount : 0
          }
        }
      }
    }
   return discountValue
  }

  freeTrialBool = false;
  getGeneralData(){
    this.subs.add(this.http.getReq('api/dashboard/account/profile').subscribe({
      next:res=>{
        localStorage.setItem('UserObj', JSON.stringify(res.data));
        if(res.data.check_subscription == null) this.freeTrialBool = true;
        else this.freeTrialBool = false;
      }
    }))
  }
}
