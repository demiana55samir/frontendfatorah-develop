import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-feature',
  templateUrl: './add-feature.component.html',
  styleUrls: ['./add-feature.component.scss']
})
export class AddFeatureComponent implements OnInit {
  featureDetailsForm!:FormGroup 
  private subs= new Subscription()
  type:any
  planId:any
  featureId:any
  language:any
  feature:any
  prevFeature:any
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
  constructor(private http:HttpService,private router:Router,private toastr:ToastrService,private fb:FormBuilder,private validserv:ValidationService,private activeRoute:ActivatedRoute,
    private changelang:ChangeLanguageService) { }

  ngOnInit() {
    this.language=this.changelang.local_lenguage
    this.type = String(this.activeRoute.snapshot.paramMap.get('type'))
    this.planId = String(this.activeRoute.snapshot.paramMap.get('PlanId'))
    this.featureId = String(this.activeRoute.snapshot.paramMap.get('featureId'))
    this.featureDetailsForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.required],
        en: ['',Validators.required] 
      }),
      description:this.fb.group({
        ar: [''], // initial value for Arabic
        en: ['']  // initial value for English
      }),

      slug: ['',Validators.required],
      value: ['',Validators.compose([Validators.required])],
      resettable_period: ['',Validators.pattern(this.validserv.numerical)],
      resettable_interval: [''],
      sort_order: ['',Validators.pattern(this.validserv.numerical)]
    })
    if(this.type=="edit" || this.type=="view"){
      this.getFeatureData(this.featureId)
    }
  }

  getFeatureData(id:any){
    this.subs.add(this.http.getReq(`api/admin/features/${id}`).subscribe({
      next:res=>{
        this.feature=res.data
        this.featureDetailsForm.patchValue(this.feature)
        this.prevFeature=this.featureDetailsForm.value;
        this.featureDetailsForm.get('name')?.setValue({
          ar: res.data.name_ar,
          en: res.data.name_en
        });
        this.featureDetailsForm.get('description')?.setValue({
          ar: res.data.description_ar,
          en: res.data.description_en
        });
      }
    }))
  }

  editFeatureData(){
    if(JSON.stringify(this.featureDetailsForm.value) != JSON.stringify(this.prevFeature)){
      if(this.featureDetailsForm.valid ){

        // let name={
        //   ar:this.featureDetailsForm.controls['name'].value,
        //   en:this.featureDetailsForm.controls['name'].value
        // }
        // this.featureDetailsForm.controls['name'].setValue(name)
        // let description={
        //   ar:this.featureDetailsForm.controls['description'].value,
        //   en:this.featureDetailsForm.controls['description'].value
        // }
        // this.featureDetailsForm.controls['description'].setValue(description)
        this.featureDetailsForm.controls['sort_order'].setValue(Number(this.featureDetailsForm.controls['sort_order'].value))
        this.subs.add(this.http.putReq(`api/admin/features/${this.featureId}`,this.featureDetailsForm.value).subscribe({
          next:res=>{

          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
            this.router.navigate(['/admin/subscription-plans/General-plan-details/features/',this.planId])

          }
        }))
      }
      else{
        this.featureDetailsForm.markAllAsTouched()
        // this.changelang.scrollToTop(); 
        this.changelang.scrollToInvalidInput(this.featureDetailsForm);
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

  addFeature(){
    if(this.featureDetailsForm.valid && this.featureDetailsForm.dirty){

        // let name={
        //   ar:this.featureDetailsForm.controls['name'].value,
        //   en:this.featureDetailsForm.controls['name'].value
        // }
        // this.featureDetailsForm.controls['name'].setValue(name)
        // let description={
        //   ar:this.featureDetailsForm.controls['description'].value,
        //   en:this.featureDetailsForm.controls['description'].value
        // }
        // this.featureDetailsForm.controls['description'].setValue(description)
        this.featureDetailsForm.controls['sort_order'].setValue(Number(this.featureDetailsForm.controls['sort_order'].value))
       this.subs.add(this.http.postReq(`api/admin/plans/${this.planId}/features`,this.featureDetailsForm.value).subscribe({
        next:res=>{

        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Plan added successfully')
          }
          else{
            this.toastr.info('تمت إضافة الخطة بنجاح.')
          }
          this.router.navigate(['/admin/subscription-plans/General-plan-details/features/',this.planId])
        },error:()=>{
          // this.featureDetailsForm.controls['name'].setValue(name.ar)
          // this.featureDetailsForm.controls['description'].setValue(description.ar)
        }
       }))
    }
    else{
      this.featureDetailsForm.markAllAsTouched();
      // this.changelang.scrollToTop();
      this.changelang.scrollToInvalidInput(this.featureDetailsForm);
      if(this.language=='en'){
        this.toastr.error('please enter Data first')
      }
      else{
        this.toastr.error('الرجاء ادخال البيانات أولاً')
      }
    }
  }
}
