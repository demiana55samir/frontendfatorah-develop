import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-duration',
  templateUrl: './add-edit-duration.component.html',
  styleUrls: ['./add-edit-duration.component.scss']
})
export class AddEditDurationComponent implements OnInit {

  private subs= new Subscription()
  durationDataForm!:FormGroup
  durationId:any
  duration:any
  type:any
  language:any
  prevDurationData:any
  primaryColor:any = ''
 
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
    this.durationId= String(this.activeRoute.snapshot.paramMap.get('id'))
    this.type= String(this.activeRoute.snapshot.paramMap.get('type'))
    this.durationDataForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.required],
        en: ['',Validators.required] 
      }),
      slug:['',Validators.required],

      // todo
      sort_order: ['',Validators.compose([Validators.required,Validators.pattern(this.validationServ.numerical)])]

    })

    if(this.type=='edit'){
      this.getDuration()
    }

  }

  getDuration(){
    this.subs.add(this.http.getReq(`api/admin/durations/${this.durationId}`).subscribe({
      next:res =>{
        this.duration=res.data
        this.durationDataForm.patchValue(this.duration)
        this.prevDurationData=this.durationDataForm.value
        this.durationDataForm.get('name')?.setValue({
          ar: res.data.name_ar,
          en: res.data.name_en
        });
      }
    }))
  }

  addDuration(){
    if(this.durationDataForm.valid && this.durationDataForm.dirty){
      
      // this.durationDataForm.controls['sort_order'].setValue(Number(this.durationDataForm.controls['sort_order'].value))
       this.subs.add(this.http.postReq('api/admin/durations',this.durationDataForm.value).subscribe({
        next:res=>{

        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Duration added successfully')
          }
          else{
            this.toastr.info('تمت إضافة المدة بنجاح.')
          }
          this.router.navigate(['/admin/settings/categories/All-durations'])
        },error:()=>{
        
        }
       }))
    }
    else{
      this.durationDataForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.durationDataForm);
    }

  }

  editDuration(){
    if(this.durationDataForm.valid){
      if(JSON.stringify(this.durationDataForm.value) != JSON.stringify(this.prevDurationData)){

        // this.durationDataForm.controls['sort_order'].setValue(Number(this.durationDataForm.controls['sort_order'].value))
         this.subs.add(this.http.putReq(`api/admin/durations/${this.durationId}`,this.durationDataForm.value).subscribe({
          next:res=>{

          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Duration Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث المدة بنجاح.')
            }
            this.router.navigate(['/admin/settings/categories/All-durations'])
          },error:()=>{
           
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
      this.durationDataForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.durationDataForm);
    }
  }

}
