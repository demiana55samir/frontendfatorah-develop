import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

interface newbank{
  name_ar:string,
  name_en:string
  number:number
  full_name:string
}
@Component({
  selector: 'app-Add-bank-account',
  templateUrl: './Add-bank-account.component.html',
  styleUrls: ['./Add-bank-account.component.scss']
})
export class AddBankAccountComponent implements OnInit {
  addBankAccountForm!:FormGroup
  private subs= new Subscription()
  uuid:any
  language:any
  viewType:any
  name={
    ar:'',
    en:'',
  }
  constructor(private fb:FormBuilder,private changeLang:ChangeLanguageService,private http:HttpService,private router:Router,private toastr:ToastrService,private activeRoute:ActivatedRoute,) { }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.uuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
    this.viewType= String(this.activeRoute.snapshot.paramMap.get('type'))
    if(this.viewType=='edit'){
     this.getBankDetails()
    }
    this.addBankAccountForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.required], // initial value for Arabic
        en: ['',Validators.required]  // initial value for English
      }),
      number:['',Validators.required],
      full_name:['',Validators.required]
    })
  }
addBankAccount(){
if(this.addBankAccountForm.valid && this.addBankAccountForm.dirty){
  // this.name.ar=this.addBankAccountForm.controls['name'].value
  // this.name.en=this.addBankAccountForm.controls['name'].value
  // this.addBankAccountForm.controls['name'].setValue(this.name)
  this.subs.add(this.http.postReq('api/dashboard/settings/banks',this.addBankAccountForm.value).subscribe({
    next:res=>{

    },complete:()=>{
      if(this.language=='en'){
        this.toastr.info('Bank Account Added Successfully')
      }
      else{
        this.toastr.info('تمت إضافة الحساب البنكي بنجاح.')

      }
      this.addBankAccountForm.reset()
    }
  }))
}
else{
  this.addBankAccountForm.markAllAsTouched()
}
}
prevBank:newbank={} as newbank
getBankDetails(){
  this.subs.add(this.http.getReq(`api/dashboard/settings/banks/${this.uuid}`).subscribe({
    next:res=>{
     this.addBankAccountForm.patchValue(res.data) 
     this.addBankAccountForm.get('name')?.setValue({
      ar: res.data.name_ar,
      en: res.data.name_en
    });

     this.prevBank.name_ar=res.data.name_ar
     this.prevBank.name_en=res.data.name_en
     this.prevBank.number=res.data.number
     this.prevBank.full_name=res.data.full_name
    }
  }))
}
editBankAccount(){
if(JSON.stringify(this.addBankAccountForm.value) != JSON.stringify(this.prevBank)){

  if(this.addBankAccountForm.valid){
    // this.name.ar=this.addBankAccountForm.controls['name'].value
    // this.name.en=this.addBankAccountForm.controls['name'].value
    // this.addBankAccountForm.controls['name'].setValue(this.name)
    this.subs.add(this.http.putReq(`api/dashboard/settings/banks/${this.uuid}`,this.addBankAccountForm.value).subscribe({
      next:res=>{
  
      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('Bank Account Updated Successfully')
        }
        else{
          this.toastr.info('تم تحديث حساب البنك بنجاح.')

        }
        this.router.navigate(['/user/settings/commercial-account-details'])
      },error:()=>{
        this.addBankAccountForm.controls['name'].setValue(this.name.ar)
      }
    }))
  }
  else{
    this.addBankAccountForm.markAllAsTouched()
  }
}
else{
  if(this.language=='en'){
    this.toastr.error('update Data first')
  }
  else{
    this.toastr.error('الرجاء تحديث البيانات أولاً')
  }
}
}
}
