import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userDetailsForm!:FormGroup
  private subs=new Subscription()
  userUuid:any
  language:any
  plans:any;
  plan_id = -1;
  btnColor:any = '#6759FF'

  userPlan = ''
  primaryColor:any = '';
  current_duration_id = ''
  constructor(private fb:FormBuilder,private toastr:ToastrService,private http:HttpService,private activeRoute:ActivatedRoute,private changelang:ChangeLanguageService) { } 
user:any={}

durations:any;
  ngOnInit() {
    if( localStorage.getItem('primaryColor') ){
      this.primaryColor = localStorage.getItem('primaryColor');
    }
      this.btnColor = (localStorage.getItem('primaryColor')) ? localStorage.getItem('primaryColor') :'#6759FF'
 
    this.language=this.changelang.local_lenguage
    this.userUuid = String(this.activeRoute.snapshot.paramMap.get('uuid'))
    this.userDetailsForm=this.fb.group({
      plan:['',Validators.required],
      end_at:['',Validators.required],
      amount:['',Validators.required],
      subscription_type:['']
    })
    this.getUserData(this.userUuid)

  }

  // chooseDuration(event:any){
  //   console.log(event.value);
  //   let index = this.durations.findIndex((duration:any) => duration.slug == event.value)
  //   if(index > -1) {
  //     let currentPrice = this.durations[index].price;
  //     this.userDetailsForm.controls['amount'].setValue(currentPrice)
  //     let currentDate = this.getDateAfterMonths(this.durations[index].period);
  //     this.userDetailsForm.controls['end_at'].setValue(currentDate)
  //   }
  // }
  onPlanChange(plan: any) {
    this.plan_id = plan.id;
    this.durations = plan.durations;
    this.userDetailsForm.controls['subscription_type'].setValue( this.durations.slug)

    
    this.userDetailsForm.controls['plan'].setValue(plan.id)
    
    this.userDetailsForm.controls['amount'].setValue(plan.price)

    // let currentDate = this.getDateAfterMonths(this.durations.period);
    // this.userDetailsForm.controls['end_at'].setValue(currentDate)
  }

  getUserPlans(){
    let param = {
      duration:true
    }
    this.subs.add(this.http.getReq(`api/admin/plans`,{params:param}).subscribe({
      next:res=>{
        this.plans = res.data;
        let index = res.data.findIndex((plan:any) => plan.id == this.user.plan.id)
        if(index > -1){
           this.durations = this.plans[index].durations;
           console.log(this.plans[index]);
           
        }
        this.userDetailsForm.controls['subscription_type'].setValue(this.current_duration_id)

        // let durationindex = this.durations.findIndex((duration:any) => duration.slug == this.current_duration_id);

        if(this.durations) {
          // let currentPrice = this.durations.price;
          // this.userDetailsForm.controls['amount'].setValue(currentPrice)

          // let currentDate = this.getDateAfterMonths(this.durations.period);
          // this.userDetailsForm.controls['end_at'].setValue(currentDate)
        }
    },
  }))
  }
  getUserData(uuid:string){
    this.subs.add(this.http.getReq(`api/admin/users/${uuid}`).subscribe({
      next:res=>{
        this.user=res.data

        this.current_duration_id = res.data.current_duration_id;
       
        this.userDetailsForm.controls['plan'].setValue(res.data.plan.id)
        this.plan_id = res.data.plan.id;

        this.userPlan = res.data.plan.name
        console.log(res?.data?.plan?.price);
        
        this.userDetailsForm.controls['amount'].setValue(res?.data?.plan?.price)
    },
    complete:()=>{
      this.getUserPlans();
    }}))
  }
  updatePlanData(){
    if(this.userDetailsForm.valid && this.userDetailsForm.dirty){
      this.subs.add(this.http.putReq(`api/admin/ajax/subscriptions/editDate/${this.userUuid}`,this.userDetailsForm.value).subscribe({
        next:res=>{
          let index = this.plans.findIndex((x:any)=> x.id === this.plan_id);
          this.userPlan = this.plans[index].name;
      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('Data Updated successfully')
        }
        else{
          this.toastr.info('تم تحديث البيانات بنجاح.')
        }
        // this.userDetailsForm.reset();
      }
    }))
    }
    else{
      this.userDetailsForm.markAllAsTouched()
      if(this.language=='en'){
        this.toastr.info('update Data first')
      }
      else{
        this.toastr.info('الرجاء تحديث البيانات أولاً')
      }
    }
  }

  getDateAfterMonths(months: number): Date {
    const currentDate = new Date(); 
    currentDate.setMonth(currentDate.getMonth() + months); 
    return currentDate; // Return the new date
  }
}
