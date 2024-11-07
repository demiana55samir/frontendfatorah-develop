import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { entity } from '@modules/settings';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-entity',
  templateUrl: './add-edit-entity.component.html',
  styleUrls: ['./add-edit-entity.component.scss']
})
export class AddEditEntityComponent implements OnInit {

  private subs= new Subscription()
  companyTypeDataForm!:FormGroup
  companyTypeId:any
  companyType:entity = {} as entity
  type:any
  language:any
  prevcompanyTypeData:any
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
    this.companyTypeId= String(this.activeRoute.snapshot.paramMap.get('id'))
    this.type= String(this.activeRoute.snapshot.paramMap.get('type'))
    this.companyTypeDataForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.compose([ Validators.required])],
        en: ['',Validators.compose([ Validators.required])] 
      }),
      slug: ['',Validators.required],
      is_enable: ['',Validators.required],
      sort_order: ['',Validators.compose([Validators.required,Validators.pattern(this.validationServ.numerical)])]
    })

    if(this.type=='edit'){
      this.getCompanyType()
    }

  }

  getCompanyType(){
    this.subs.add(this.http.getReq(`api/admin/company_types/${this.companyTypeId}`).subscribe({
      next:res =>{
        this.companyType=res.data
        this.companyTypeDataForm.patchValue(this.companyType)
        this.prevcompanyTypeData=this.companyTypeDataForm.value
        this.companyTypeDataForm.get('name')?.setValue({
          ar: res.data.name_ar,
          en: res.data.name_en
        });
      }
    }))
  }

  addCompanyType(){
    if(this.companyTypeDataForm.valid && this.companyTypeDataForm.dirty){
     
       this.subs.add(this.http.postReq('api/admin/company_types',this.companyTypeDataForm.value).subscribe({
        next:res=>{

        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Company type added successfully')
          }
          else{
            this.toastr.info('تمت إضافة الكيان بنجاح.')
          }
          this.router.navigate(['/admin/settings/entities/All-entities'])
        }
       }))
    }
    else{
      this.companyTypeDataForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.companyTypeDataForm);
    }

  }

  editCompanyType(){
    if(this.companyTypeDataForm.valid){
      this.companyTypeDataForm.controls['sort_order'].setValue(Number(this.companyTypeDataForm.controls['sort_order'].value))
      if(JSON.stringify(this.companyTypeDataForm.value) != JSON.stringify(this.prevcompanyTypeData)){
      
         this.subs.add(this.http.putReq(`api/admin/company_types/${this.companyTypeId}`,this.companyTypeDataForm.value).subscribe({
          next:res=>{

          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Data updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
            this.router.navigate(['/admin/settings/entities/All-entities'])
          }
         }))
      }
      else{
        if(this.language=='en'){
          this.toastr.error('Please update data first')
        }
        else{
          this.toastr.error('الرجاء تحديث البيانات أولاً')
        }
      }
    }
    else{
      this.companyTypeDataForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.companyTypeDataForm);
    }
  }

}
