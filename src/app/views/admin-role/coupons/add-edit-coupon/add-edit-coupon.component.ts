import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { subscription_plans } from '@modules/subscription-plans';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

const datePipe = new DatePipe('en-EG');
interface coupon{
  code:any,
  plan_id:any,
  starts_at:any,
  expires_at:any,
  using_times: any,
  type:any,
  discount:any,
  subscription:any,
  is_active:any
}

interface plan{
  id:number | null,
  name:string
}

@Component({
  selector: 'app-add-edit-coupon',
  templateUrl: './add-edit-coupon.component.html',
  styleUrls: ['./add-edit-coupon.component.scss']
})
export class AddEditCouponComponent implements OnInit {
 private subs = new Subscription()
 couponDataForm!:FormGroup
 DiscountType:any=[
  {
    nameAR:'قيمة',
    nameEN:'Value',
    value:'value'
     },
  {
    nameAR:'نسبة مئوية',
    nameEN:'percentage',
    value:'percentage'
     },
 ]
 subscriptionType:any=[
  {
nameAR:'جميع الاشتراكات',
nameEN:'All Subscriptions',
value:'all'
 },
  {
nameAR:'اشتراكات شهرية',
nameEN:'Monthly Subscriptions',
value:'monthly'
 },
  {
nameAR:'اشتراكات سنوية',
nameEN:'Yearly Subscriptions',
value:'yearly'
 },
]
 PlanType:any=[
  {
    nameAR:'كل الباقات',
    nameEN:'All Plans',
    value:null
  },
  {
    nameAR:'باقة الأعمال الأساسية',
    nameEN:'Basic Business Plan',
    value:2
  },
  {
    nameAR:'باقة الأعمال الاحترافية',
    nameEN:'Professional Business Plan',
    value:3
  },
 ]
 type:any
 couponId:any
 coupon:coupon = {} as coupon
 Prevcoupon:coupon = {} as coupon
 language:any
 primaryColor:any ='';
 getDataBool:boolean = false;
  constructor(private http:HttpService,private fb:FormBuilder,private ValidationSer:ValidationService,
   private changelang:ChangeLanguageService,private toastr:ToastrService,private router:Router,private activeRoute:ActivatedRoute ) { 
    
  }

  ngOnInit() {
    if( localStorage.getItem('primaryColor') ){
      this.primaryColor = localStorage.getItem('primaryColor');
    }
    this.language=this.changelang.local_lenguage
    this.type = String(this.activeRoute.snapshot.paramMap.get('type'))
    this.couponId = String(this.activeRoute.snapshot.paramMap.get('id'))

    this.couponDataForm=this.fb.group({
    
        code: ['',Validators.required],
        plan_id:[null] ,
        starts_at:[''] ,
        expires_at:[''] ,
        using_times: ['',Validators.pattern(this.ValidationSer.numerical)],
        type: ['',Validators.required] ,
        discount:['',Validators.compose([Validators.required,Validators.pattern(this.ValidationSer.numerical)])] ,
        subscription: [''],
        is_active:['']
    
    })
    this.getDurations();
  }
  durations:any = [];
  filteredDurations:any = [];
  getDurations(){
    this.subs.add(this.http.getReq('api/landing/durations').subscribe({
      next:res=>{
        let allItemName = this.language == 'en' ? 'All Subscriptions' :'جميع الاشتراكات'
        let allItem = {
          name:allItemName,
          slug:'all'
        }
        // this.durations.push(allItem);
        this.durations=res.data;

        // this.filteredDurations = this.durations.filter((duration: any) => duration.plans_count > 0);

        this.durations.push(allItem)
      },
      complete:()=>{
        // if(this.filteredDurations.length > 0){
        //   this.currentDuration = this.filteredDurations[0].id;
        // }

        // this.getPlansByDuration(this.currentDuration);

        if(this.type=='edit' && !this.getDataBool){
          this.getCouponData(this.couponId)
        }
      }
    }))
  }

  subscriptionPlanes:plan[] = []
  currentDuration = -1;
  chooseDurationFilter(durationSlug:any){
    console.log(durationSlug);
    
    if(durationSlug == 'all'){
      this.currentDuration = -1;
      this.getAllPlans()
    }else{
      let index = this.durations.findIndex((item:any) => item.slug == durationSlug)
   
      if(index > -1) {
        this.currentDuration = this.durations[index].id;
        this.getPlansByDuration(this.currentDuration);

      }
    }

    
  }

  getAllPlans(){
    this.subs.add(this.http.getReq(`api/admin/plans?duration=true`,).subscribe({
      next:res=>{
        let allItemName = this.language == 'en' ? 'All Plans' :' كل الباقات '
        let allItem = {
          name:allItemName,
          id:null,
        }
     
        this.subscriptionPlanes=res.data;
        this.subscriptionPlanes.push(allItem)
      }
    }))
  }
  getPlansByDuration(durationId:number){

    let param={
      duration_id:durationId
    }

    this.subs.add(this.http.getReq(`api/landing/plans`,{params:param}).subscribe({
      next:res=>{
        let allItemName = this.language == 'en' ? 'All Plans' :' كل الباقات '
        let allItem = {
          name:allItemName,
          id:null,
        }
     
        this.subscriptionPlanes=res.packages;
        this.subscriptionPlanes.push(allItem)
      },
      complete:()=>{
        //  if(this.type=='edit' && !this.getDataBool){
        //    this.getCouponData(this.couponId)
        //  }
      }
    }))
  }


  prevExpired:any
  prevStarted:any
  addCoupon(){
    if(this.couponDataForm.valid && this.couponDataForm.dirty){
      this.couponDataForm.controls['discount'].setValue(Number(this.couponDataForm.controls['discount'].value))
      this.couponDataForm.controls['using_times'].setValue(Number(this.couponDataForm.controls['using_times'].value))
      this.prevExpired=this.couponDataForm.controls['expires_at'].value
      this.prevStarted=this.couponDataForm.controls['starts_at'].value
      this.couponDataForm.controls['expires_at'].setValue(datePipe.transform( this.couponDataForm.controls['expires_at'].value, 'yyyy-MM-ddTHH:mm')) ,
      this.couponDataForm.controls['starts_at'].setValue(datePipe.transform( this.couponDataForm.controls['starts_at'].value, 'yyyy-MM-ddTHH:mm')) ,
      this.subs.add(this.http.postReq('api/admin/vouchers',this.couponDataForm.value).subscribe({
       next:res=>{
   
       },complete:()=>{
         if(this.language=='en'){
           this.toastr.info('Coupon added successfully')
         }
         else{
           this.toastr.info('تمت إضافة الكوبون بنجاح.')
         }
         this.router.navigate(['/admin/coupons/All-coupons'])
       },error:()=>{
        this.couponDataForm.controls['expires_at'].setValue( this.prevExpired) 
        this.couponDataForm.controls['starts_at'].setValue(this.prevStarted) 
       }
      }))

    }
    else{
      this.couponDataForm.markAllAsTouched()
    }
  }
  getCouponData(id:any){
    this.subs.add(this.http.getReq(`api/admin/vouchers/${id}`).subscribe({
      next:res=>{
        this.coupon=res.data
        this.coupon.starts_at=datePipe.transform( res.data.starts_at , 'yyyy-MM-dd')
        this.coupon.expires_at=datePipe.transform( res.data.expires_at , 'yyyy-MM-dd')
        if(this.coupon.plan_id==""){
          this.coupon.plan_id=null
           this.currentDuration = -1
        }else{
          this.currentDuration = this.coupon.plan_id;
        }
        this.couponDataForm.patchValue(this.coupon)
        this.Prevcoupon= this.couponDataForm.value

      },
      complete:()=>{
        this.getDataBool = true;
        this.getPlansByDuration(this.currentDuration);
      }
    }))

  }
  editCoupon(){
    // console.log('1'+ ' ' + JSON.stringify(this.couponDataForm.value))
    // console.log('2  '+ JSON.stringify(this.Prevcoupon))
     if(JSON.stringify(this.couponDataForm.value) != JSON.stringify(this.Prevcoupon)){
       if(this.couponDataForm.valid){
        this.prevExpired=this.couponDataForm.controls['expires_at'].value
        this.prevStarted=this.couponDataForm.controls['starts_at'].value
        this.couponDataForm.controls['expires_at'].setValue(datePipe.transform( this.couponDataForm.controls['expires_at'].value, 'yyyy-MM-ddTHH:mm')) ;
        this.couponDataForm.controls['starts_at'].setValue(datePipe.transform( this.couponDataForm.controls['starts_at'].value, 'yyyy-MM-ddTHH:mm')) ;

        if(this.couponDataForm.controls['is_active'].value==true){
          // console.log('in')
          this.couponDataForm.controls['is_active'].setValue(1)
        }else{
          this.couponDataForm.controls['is_active'].setValue(0)
        }
        
        this.subs.add(this.http.putReq(`api/admin/vouchers/${this.couponId}`,this.couponDataForm.value).subscribe({
          next:res=>{

          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
            this.router.navigate(['/admin/coupons/All-coupons'])

          },error:()=>{
            this.couponDataForm.controls['expires_at'].setValue( this.prevExpired) 
            this.couponDataForm.controls['starts_at'].setValue(this.prevStarted)
          }
        }))
       }
     }
     else{
      if(this.language=='en'){
        this.toastr.error('please update Data first')
      }
      else{
        this.toastr.error('الرجاء تحديث البيانات أولاً')
      }
     }
  }
}
