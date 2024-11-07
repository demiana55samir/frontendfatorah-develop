import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { city } from '@modules/settings';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-city',
  templateUrl: './add-edit-city.component.html',
  styleUrls: ['./add-edit-city.component.scss']
})
export class AddEditCityComponent implements OnInit {
  private subs= new Subscription()
  cityDataForm!:FormGroup
  cityId:any
  city:city = {} as city;
  type:any
  language:any
  prevCityData:any
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
    this.cityId= String(this.activeRoute.snapshot.paramMap.get('id'))
    this.type= String(this.activeRoute.snapshot.paramMap.get('type'))
    this.cityDataForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.compose([Validators.required])],
        en: ['',Validators.compose([Validators.required])] 
      }),
      slug: ['',Validators.required],
      is_enable: ['',Validators.required],
      sort_order: ['',Validators.compose([Validators.required,Validators.pattern(this.validationServ.numerical)])]
    })

    if(this.type=='edit'){
      this.getCity()
    }

  }

  getCity(){
    this.subs.add(this.http.getReq(`api/admin/cities/${this.cityId}`).subscribe({
      next:res =>{
        this.city=res.data
        this.cityDataForm.patchValue(this.city)
        this.prevCityData=this.cityDataForm.value
        this.cityDataForm.get('name')?.setValue({
          ar: res.data.name_ar,
          en: res.data.name_en
        });
      }
    }))
  }

  addCity(){
    if(this.cityDataForm.valid && this.cityDataForm.dirty){

       this.subs.add(this.http.postReq('api/admin/cities',this.cityDataForm.value).subscribe({
        next:res=>{

        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('City added successfully')
          }
          else{
            this.toastr.info('تمت إضافة المدينة بنجاح.')
          }
          this.router.navigate(['/admin/settings/cities/All-cities'])
        }
       }))
    }
    else{
      this.cityDataForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.cityDataForm);
    }

  }

  editCity(){
    if(this.cityDataForm.valid){
      this.cityDataForm.controls['sort_order'].setValue(Number(this.cityDataForm.controls['sort_order'].value))
      if(JSON.stringify(this.cityDataForm.value) != JSON.stringify(this.prevCityData)){
         this.subs.add(this.http.putReq(`api/admin/cities/${this.cityId}`,this.cityDataForm.value).subscribe({
          next:res=>{

          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
            this.router.navigate(['/admin/settings/cities/All-cities'])
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
      this.cityDataForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.cityDataForm);
    }
  }

}
