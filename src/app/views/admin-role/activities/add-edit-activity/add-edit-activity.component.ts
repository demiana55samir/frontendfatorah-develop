import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { activity } from '@modules/settings';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-activity',
  templateUrl: './add-edit-activity.component.html',
  styleUrls: ['./add-edit-activity.component.scss']
})
export class AddEditActivityComponent implements OnInit {

  private subs= new Subscription()
  activityDataForm!:FormGroup
  activityId:any
  activity:activity = {} as activity;
  type:any
  language:any
  prevActivityData:any
  primaryColor:any = '';
  constructor(private fb:FormBuilder,
    private http:HttpService,
    private activeRoute:ActivatedRoute,
    private changeLang:ChangeLanguageService,
    private toastr:ToastrService,
    private router:Router,
    private validationServ:ValidationService
    ) { }

  ngOnInit() {
    if( localStorage.getItem('primaryColor') ){
      this.primaryColor = localStorage.getItem('primaryColor');
    }
   
    this.language=this.changeLang.local_lenguage
    this.activityId= String(this.activeRoute.snapshot.paramMap.get('id'))
    this.type= String(this.activeRoute.snapshot.paramMap.get('type'))
    this.activityDataForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.compose([Validators.required])],
        en: ['',Validators.compose([Validators.required])] 
      }),
      slug: ['',Validators.required],
      is_enable: ['',Validators.required],
      sort_order: ['',Validators.compose([Validators.required,Validators.pattern(this.validationServ.numerical)])]
    })

    if(this.type=='edit'){
      this.getActivity()
    }

  }

  getActivity(){
    this.subs.add(this.http.getReq(`api/admin/business_types/${this.activityId}`).subscribe({
      next:res =>{
        this.activity=res.data
        this.activityDataForm.patchValue(this.activity)
        this.prevActivityData=this.activityDataForm.value
        this.activityDataForm.get('name')?.setValue({
          ar: res.data.name_ar,
          en: res.data.name_en
        });
      }
    }))
  }

  addActivity(){
    if(this.activityDataForm.valid && this.activityDataForm.dirty){
       this.subs.add(this.http.postReq('api/admin/business_types',this.activityDataForm.value).subscribe({
        next:res=>{

        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Activity added successfully')
          }
          else{
            this.toastr.info('تمت إضافة النشاط بنجاح.')
          }
          this.router.navigate(['/admin/settings/activities/All-activities'])
        }
       }))
    }
    else{
      this.activityDataForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.activityDataForm);
    }

  }

  editActivity(){
    if(this.activityDataForm.valid){
      this.activityDataForm.controls['sort_order'].setValue(Number(this.activityDataForm.controls['sort_order'].value))
      if(JSON.stringify(this.activityDataForm.value) != JSON.stringify(this.prevActivityData)){
       
         this.subs.add(this.http.putReq(`api/admin/business_types/${this.activityId}`,this.activityDataForm.value).subscribe({
          next:res=>{

          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
            this.router.navigate(['/admin/settings/activities/All-activities'])
          }
         }))
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
    else{
      this.activityDataForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.activityDataForm);
    }
  }

}
