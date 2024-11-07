import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-add-edit-plan',
  templateUrl: './add-edit-plan.component.html',
  styleUrls: ['./add-edit-plan.component.scss']
})
export class AddEditPlanComponent implements OnInit {
 language:any
 type:any
 planId:any
 private subs= new Subscription()
 plan:any
 prevPlan:any
 planDetailsForm!:FormGroup
 interval=[
  {
    nameAR:'ساعة',
    nameEN:'Hour',
    value:'hour'
  },
  {
    nameAR:'يوم',
    nameEN:'Day',
    value:'day'
  },
  {
    nameAR:'أسبوع',
    nameEN:'Week',
    value:'week'
  },
  {
    nameAR:'شهر',
    nameEN:'Month',
    value:'month'
  },
 ]

 currency:any;
 mobileSize = false;
 primaryColor:any =''

 durations = [];

  constructor(private http:HttpService,private fb:FormBuilder,private ValidationSer:ValidationService,
    private changelang:ChangeLanguageService,private toastr:ToastrService,private router:Router,private activeRoute:ActivatedRoute ) { 
     
   }
  ngOnInit() {
    if( localStorage.getItem('primaryColor') ){
      this.primaryColor = localStorage.getItem('primaryColor');
    }
    this.mobileSize = window.innerWidth <= 768; 
    this.language=this.changelang.local_lenguage
    this.type = String(this.activeRoute.snapshot.paramMap.get('type'))
    this.planId = String(this.activeRoute.snapshot.paramMap.get('id'))
    this.getCurrencies()
    if(this.type=='edit'){
       this.getPlanData(this.planId)
    }
    this.planDetailsForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.required],
        en: ['',Validators.required] 
      }),
      description:this.fb.group({
        ar: [''], // initial value for Arabic
        en: ['']  // initial value for English
      }),
      slug: ['',Validators.required],
      price:['',Validators.compose([Validators.required,Validators.pattern(this.ValidationSer.numerical)])],
      signup_fee: ['',Validators.compose([Validators.required,Validators.pattern(this.ValidationSer.numerical)])],
      currency: ['',Validators.required],
      sort_order: ['',Validators.compose([Validators.required,Validators.pattern(this.ValidationSer.numerical)])],
      is_active: [false],
      trial_period: ['',Validators.pattern(this.ValidationSer.numerical)],
      trial_interval: ['day'],
      invoice_period: ['',Validators.pattern(this.ValidationSer.numerical)],
      invoice_interval: ['day'],
      grace_period: ['',Validators.pattern(this.ValidationSer.numerical)],
      grace_interval: ['day'],
      prorate_day: ['',Validators.pattern(this.ValidationSer.numerical)],
      prorate_period: ['',Validators.pattern(this.ValidationSer.numerical)],
      prorate_extend_due: ['',Validators.pattern(this.ValidationSer.numerical)],
      active_subscribers_limit:['',Validators.pattern(this.ValidationSer.numerical)],
      duration_id:['',Validators.required],

      // todo : check key name
      full_price:['',Validators.compose([Validators.required,Validators.pattern(this.ValidationSer.numerical)])]
    })

    this.getDurations()
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.mobileSize = window.innerWidth <= 768; 
  }
  
  getDurations(){
    this.subs.add(this.http.getReq('api/admin/ajax/durations').subscribe({
      next:res=>{
        this.durations=res.data
      }
    }))
  }

  getCurrencies(){
    this.subs.add(this.http.getReq(`api/admin/currencies`).subscribe({
      next:res=>{
        this.currency=res.data
      }
    }))
  }
  getPlanData(id:any){
    this.subs.add(this.http.getReq(`api/admin/plans/${id}`).subscribe({
      next:res=>{
        this.plan=res.data
        this.planDetailsForm.patchValue(this.plan)
        this.planDetailsForm.controls['currency'].setValue(res.data.currency_code)
        this.planDetailsForm.controls['duration_id'].setValue(res.data?.durations.id)
        this.prevPlan=this.planDetailsForm.value;

        this.planDetailsForm.get('name')?.setValue({
          ar: res.data.name_ar,
          en: res.data.name_en
        });
        this.planDetailsForm.get('description')?.setValue({
          ar: res.data.description_ar,
          en: res.data.description_en
        });
      }
    }))
  }

  editPlanData(){
    if(JSON.stringify(this.planDetailsForm.value) != JSON.stringify(this.prevPlan)){
      if(this.planDetailsForm.valid ){
        this.planDetailsForm.controls['price'].setValue(Number(this.planDetailsForm.controls['price'].value))
        this.planDetailsForm.controls['signup_fee'].setValue(Number(this.planDetailsForm.controls['signup_fee'].value))
        this.planDetailsForm.controls['sort_order'].setValue(Number(this.planDetailsForm.controls['sort_order'].value))
        this.planDetailsForm.controls['trial_period'].setValue(Number(this.planDetailsForm.controls['trial_period'].value))
        this.planDetailsForm.controls['invoice_period'].setValue(Number(this.planDetailsForm.controls['invoice_period'].value))
        this.planDetailsForm.controls['grace_period'].setValue(Number(this.planDetailsForm.controls['grace_period'].value))
        this.planDetailsForm.controls['prorate_day'].setValue(Number(this.planDetailsForm.controls['prorate_day'].value))
        this.planDetailsForm.controls['prorate_period'].setValue(Number(this.planDetailsForm.controls['prorate_period'].value))
        this.planDetailsForm.controls['prorate_extend_due'].setValue(Number(this.planDetailsForm.controls['prorate_extend_due'].value))
        this.planDetailsForm.controls['active_subscribers_limit'].setValue(Number(this.planDetailsForm.controls['active_subscribers_limit'].value))
        // let name={
        //   ar:this.planDetailsForm.controls['name'].value,
        //   en:this.planDetailsForm.controls['name'].value
        // }
        // this.planDetailsForm.controls['name'].setValue(name)
        // let description={
        //   ar:this.planDetailsForm.controls['description'].value,
        //   en:this.planDetailsForm.controls['description'].value
        // }
        // this.planDetailsForm.controls['description'].setValue(description)
        this.subs.add(this.http.putReq(`api/admin/plans/${this.planId}`,this.planDetailsForm.value).subscribe({
          next:res=>{

          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
            this.router.navigate(['/admin/subscription-plans/All-plans'])

          },error:()=>{
            // this.planDetailsForm.controls['name'].setValue(name.ar)
            // this.planDetailsForm.controls['description'].setValue(description.ar)
          }
        }))
      }
      else{
        
        this.planDetailsForm.markAllAsTouched();
        // this.changelang.scrollToTop();
        this.changelang.scrollToInvalidInput(this.planDetailsForm);
        if(this.language=='en'){
          this.toastr.error('please update Data first')
        }
        else{
          this.toastr.error('الرجاء تحديث البيانات أولاً')
        }
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

  addPlan(){
    if(this.planDetailsForm.valid && this.planDetailsForm.dirty){
        this.planDetailsForm.controls['price'].setValue(Number(this.planDetailsForm.controls['price'].value))
        this.planDetailsForm.controls['signup_fee'].setValue(Number(this.planDetailsForm.controls['signup_fee'].value))
        this.planDetailsForm.controls['sort_order'].setValue(Number(this.planDetailsForm.controls['sort_order'].value))
        this.planDetailsForm.controls['trial_period'].setValue(Number(this.planDetailsForm.controls['trial_period'].value))
        this.planDetailsForm.controls['invoice_period'].setValue(Number(this.planDetailsForm.controls['invoice_period'].value))
        this.planDetailsForm.controls['grace_period'].setValue(Number(this.planDetailsForm.controls['grace_period'].value))
        this.planDetailsForm.controls['prorate_day'].setValue(Number(this.planDetailsForm.controls['prorate_day'].value))
        this.planDetailsForm.controls['prorate_period'].setValue(Number(this.planDetailsForm.controls['prorate_period'].value))
        this.planDetailsForm.controls['prorate_extend_due'].setValue(Number(this.planDetailsForm.controls['prorate_extend_due'].value))
        this.planDetailsForm.controls['active_subscribers_limit'].setValue(Number(this.planDetailsForm.controls['prorate_extend_due'].value))
        // let name={
        //   ar:this.planDetailsForm.controls['name'].value,
        //   en:this.planDetailsForm.controls['name'].value
        // }
        // this.planDetailsForm.controls['name'].setValue(name)
        // let description={
        //   ar:this.planDetailsForm.controls['description'].value,
        //   en:this.planDetailsForm.controls['description'].value
        // }
        // this.planDetailsForm.controls['description'].setValue(description)
        
       this.subs.add(this.http.postReq('api/admin/plans',this.planDetailsForm.value).subscribe({
        next:res=>{

        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Plan added successfully')
          }
          else{
            this.toastr.info('تمت إضافة الخطة بنجاح.')
          }
          this.router.navigate(['/admin/subscription-plans/All-plans'])
        },error:()=>{
          // this.planDetailsForm.controls['name'].setValue(name.ar)
          // this.planDetailsForm.controls['description'].setValue(description.ar)
        }
       }))
    }
    else{
      this.planDetailsForm.markAllAsTouched();
      // this.changelang.scrollToTop();
      this.changelang.scrollToInvalidInput(this.planDetailsForm);
      if(this.language=='en'){
        this.toastr.error('please enter Data first')
      }
      else{
        this.toastr.error('الرجاء ادخال البيانات أولاً')
      }
    }
  }

}
