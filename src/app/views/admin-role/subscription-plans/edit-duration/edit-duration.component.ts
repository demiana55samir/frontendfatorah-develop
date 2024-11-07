import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { duration } from '@modules/subscription-plans';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-duration',
  templateUrl: './edit-duration.component.html',
  styleUrls: ['./edit-duration.component.scss']
})
export class EditDurationComponent implements OnInit {

  durationDetailsForm!:FormGroup 
  private subs= new Subscription()
  type:any
  planId:any
  durationId:any
  language:any
  duration:duration = {} as duration;
  prevDuration:any

  durations = []
  constructor(private http:HttpService,private router:Router,
    private toastr:ToastrService,private fb:FormBuilder,
    private validserv:ValidationService,private activeRoute:ActivatedRoute,
    private changelang:ChangeLanguageService) { }

  ngOnInit() {
    this.language=this.changelang.local_lenguage

    this.type = String(this.activeRoute.snapshot.paramMap.get('type'))
    this.planId = String(this.activeRoute.snapshot.paramMap.get('PlanId'))
    this.durationId = String(this.activeRoute.snapshot.paramMap.get('durationId'))

    this.durationDetailsForm=this.fb.group({
      price : [''],
      duration_id : [''],
      plan_id:this.planId
    })
    this.getDurations();

    if(this.type=="edit" || this.type=="view"){
      this.getDurationData(this.durationId)
    }
  }

  getDurationData(id:any){
    this.subs.add(this.http.getReq(`api/admin/plan/durations/${id}`).subscribe({
      next:res=>{
        this.durationDetailsForm.patchValue(res.data)
        this.prevDuration=this.durationDetailsForm.value
      }
    }))
  }

  editFeatureData(){
    // this.durationDetailsForm.addControl('plan_id',this.planId)
    if(JSON.stringify(this.durationDetailsForm.value) != JSON.stringify(this.prevDuration)){
      if(this.durationDetailsForm.valid ){

       
        this.subs.add(this.http.putReq(`api/admin/plan/durations/${this.durationId}`,this.durationDetailsForm.value).subscribe({
          next:res=>{

          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
            this.router.navigateByUrl(`/admin/subscription-plans/General-plan-details/details/${this.planId}`)

          },error:()=>{
          }
        }))
      }
      else{
        this.durationDetailsForm.markAllAsTouched();
        // this.changelang.scrollToTop();
        this.changelang.scrollToInvalidInput(this.durationDetailsForm);
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
    if(this.durationDetailsForm.valid && this.durationDetailsForm.dirty){

       this.subs.add(this.http.postReq(`api/admin/plans/${this.planId}/durations`,this.durationDetailsForm.value).subscribe({
        next:res=>{

        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Duration added successfully')
          }
          else{
            this.toastr.info('تمت إضافة المدة بنجاح.')
          }
          this.router.navigateByUrl(`/admin/subscription-plans/General-plan-details/details/${this.planId}`)
        },error:()=>{
        }
       }))
    }
    else{
      this.durationDetailsForm.markAllAsTouched();
      // this.changelang.scrollToTop();
      this.changelang.scrollToInvalidInput(this.durationDetailsForm);
    }
  }

  getDurations(){
    this.subs.add(this.http.getReq('api/landing/durations').subscribe({
      next:res=>{
        this.durations=res.data
      }
    }))
  }
}
