import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {
  currency=[{name:'SAR'}]
  private subs=new Subscription()
  generalInfo:any[]=[]
  prevCurrency:any
  choosenCurrency:any
  language:any
  constructor(private http:HttpService,private changeLang:ChangeLanguageService,private fb:FormBuilder,private toastr:ToastrService) { }

  ngOnInit() {
    this.getGeneralData()
    this.language=this.changeLang.local_lenguage
  }

  getGeneralData(){
    this.subs.add(this.http.getReq('api/dashboard/settings/general').subscribe({
      next:res=>{
        this.generalInfo=res.data
        this.prevCurrency=res.data.currency
        this.choosenCurrency=res.data.currency
      }
    }))
  }
 changeCurrency(){
  if(this.choosenCurrency != this.prevCurrency){
    let body={
      'currency':this.choosenCurrency
    }
    this.subs.add(this.http.putReq('',body).subscribe({
      next:res=>{

      },complete:()=> {
        if(this.language=='en'){
          this.toastr.info('Data Updated successfully')
        }
        else{
          this.toastr.info('تم تحديث البيانات بنجاح.')
        }
      },
    }))
  }
  else{
    if(this.language=='en'){
      this.toastr.error('update Data first')
    }
    else{
      this.toastr.error('الرجاء تحديث البيانات أولاً')
    }  }
 }
}
