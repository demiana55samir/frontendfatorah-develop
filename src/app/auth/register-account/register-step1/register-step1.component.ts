import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { HttpService } from '@services/http.service';
import { CountryISO, PhoneNumberFormat ,SearchCountryField } from 'ngx-intl-tel-input';
import { ValidationService } from '@services/validation.service';
import { Subscription } from 'rxjs';
import { ChangeLanguageService } from '@services/changeLanguage.service';

@Component({
  selector: 'app-register-step1',
  templateUrl: './register-step1.component.html',
  styleUrls: ['./register-step1.component.scss']
})
export class RegisterStep1Component implements OnInit {
  showPassword!: boolean;
  showPasswordConf!: boolean;
  registerForm!:FormGroup
  selectedCountry:any
  private subs=new Subscription()
Name={
  en:'',
  ar:''
}

language:any
separateDialCode = false;
SearchCountryField = SearchCountryField;
CountryISO = CountryISO;
PhoneNumberFormat = PhoneNumberFormat;
preferredCountries: CountryISO[] = [CountryISO.Egypt];
  constructor(private fb:FormBuilder,private changeLang:ChangeLanguageService,private validationServ:ValidationService,private router:Router,private http:HttpService,private authserv:AuthService) { }

  ngOnInit() {
    this.termsAndConditions()
    this.language=this.changeLang.local_lenguage
    this.registerForm=this.fb.group({
      name: ['',Validators.required],
      phone: ['', Validators.compose([Validators.required, Validators.pattern(this.validationServ.saudiNumber) , Validators.minLength(12)])],
    
      phoneObj: ['',Validators.compose([Validators.required])],
      email: ['',Validators.compose([Validators.required,Validators.email])],
      password: ['',Validators.compose([Validators.pattern(this.validationServ.passwordGeneral),Validators.required])],
      password_confirmation: ['',Validators.required],
      accept_terms: ['',Validators.required]
    }, {
      validator: this.validationServ.confirmPasswordmatch
    }
    )
  }
  userUUID:any
  phone:any
  phoneObj:any

  fillPhone(){
    if(this.registerForm.controls['phoneObj'].value){
      this.phoneObj=this.registerForm.controls['phoneObj'].value
      this.phone=this.registerForm.controls['phoneObj'].value
      this.phone = this.phone.e164Number.replace("+", "")
      this.registerForm.controls['phone'].setValue(this.phone)
    }
  }
  register(){
    // console.log(this.registerForm.controls['phoneObj'])
    // console.log(this.phoneObj);
    
    // return

    if(this.registerForm.controls['phoneObj'].value){
      this.phoneObj=this.registerForm.controls['phoneObj'].value
      this.phone=this.registerForm.controls['phoneObj'].value
      this.phone = this.phone.e164Number.replace("+", "")
      this.registerForm.controls['phone'].setValue(this.phone)
      this.registerForm.removeControl('phoneObj');
    }
    if(this.registerForm.controls['accept_terms'].value==false){
      this.registerForm.controls['accept_terms'].setValue('')
    }
    
      setTimeout(()=>{
        if(this.registerForm.valid && this.registerForm.dirty){
    
          this.subs.add(this.http.postReq('api/auth/register',this.registerForm.value).subscribe({
            next:res=>{
              this.authserv.setUserToken(res?.token)   
                this.authserv.setUserObj(res?.user)
                this.userUUID=res.user.uuid
                let default_template_id='1'
            localStorage.setItem('default_template_id',default_template_id)
            localStorage.setItem('primaryColor',res.user.button_primary_color)
            localStorage.setItem('secondaryColor',res.user.button_secondary_color)
            localStorage.setItem('dashboardColor',res.user.website_color)
            localStorage.setItem('invoiceColor',res.user.invoice_color)
            },complete:()=>{
              this.router.navigate(['/auth/register-step2'])
            },error:()=>{
              const newFormControl = new FormControl('');
              this.registerForm.addControl('phoneObj',newFormControl); 
              this.registerForm.controls['phoneObj'].setValue(this.phoneObj)
            }
          }))
        }
        else{
          this.registerForm.markAllAsTouched()
          const newFormControl = new FormControl('');
          this.registerForm.addControl('phoneObj',newFormControl); 
          this.registerForm.controls['phoneObj'].setValue(this.phoneObj)
        }
      },400)


  }

  changePreferredCountries() {
		this.preferredCountries = [CountryISO.Egypt, CountryISO.SaudiArabia,CountryISO.UnitedArabEmirates];
	}
  termsAndCondtions:any
  termsAndConditions(){
    this.subs.add(this.http.getReq('api/terms_and_conditions').subscribe({
      next:res=>{
        this.termsAndCondtions=res.data
      }
    }))
  }
}
