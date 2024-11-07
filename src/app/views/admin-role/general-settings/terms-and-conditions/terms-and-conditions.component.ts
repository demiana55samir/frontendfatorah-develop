import { Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
termsAndConditions_ar:any
termsAndConditions_en:any

prevTermsAndConditions_ar:any
prevTermsAndConditions_en:any
private subs=new Subscription()
language:any;

currentLang = 'ar';
  constructor(private http:HttpService,private changeLang:ChangeLanguageService,private toastr:ToastrService) { }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.getTermsAndConditions()
  }
  getTermsAndConditions(){
    this.subs.add(this.http.getReq('api/admin/settings/terms-conditions').subscribe({
      next:res=>{
      //  this.termsAndConditions_ar=res.data.value
      //  this.prevTermsAndConditions_ar=res.data.value

      //  todo add new translated keys;
       this.termsAndConditions_ar=res.data.value.ar
       this.termsAndConditions_en=res.data.value.en
       

      //  this.prevTermsAndConditions_ar=res.data.value_ar;
      //  this.prevTermsAndConditions_en=res.data.value_en;
      }
    }))

  }
  editTermsAndConditions(){
  if(this.termsAndConditions_ar != this.prevTermsAndConditions_ar 
    || this.termsAndConditions_en != this.prevTermsAndConditions_en){
    let DataWithLanguage={
      'en':this.termsAndConditions_en,
      'ar':this.termsAndConditions_ar
    }
    this.subs.add(this.http.putReq('api/admin/settings',{'terms_and_conditions':DataWithLanguage}).subscribe({
      next:res=>{

      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('Data Updated successfully')
        }
        else{
          this.toastr.info('تم تحديث البيانات بنجاح.')
        }
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

}
