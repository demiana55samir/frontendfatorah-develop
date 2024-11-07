import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  resetPasswordFrorm!:FormGroup
  emailVerficationForm!:FormGroup
  verificationForm!:FormGroup
  showPassword!: boolean;
  showPasswordConf!: boolean;
  email:string=''
  code:any
  step:number=1
  private subs=new Subscription()
  language:any
  constructor(private formBuilder:FormBuilder,private renderer: Renderer2,private changeLanguage:ChangeLanguageService,private validationService:ValidationService,private http:HttpService,private router:Router,private ValidationSer:ValidationService) {  }

  ngOnInit() {
    this.language=this.changeLanguage.local_lenguage
    this.emailVerficationForm=this.formBuilder.group({
      email:['',[Validators.compose([Validators.email,Validators.required])]],
    })
    this.resetPasswordFrorm=this.formBuilder.group({
      new_password:['',[Validators.compose([Validators.required,Validators.pattern(this.validationService.passwordGeneral)])]],
      new_password_confirmation:['',Validators.required]
    },{
      validator: this.ValidationSer.confirmPasswordMismatchacc
    }
    )
    this.verificationForm = this.formBuilder.group({
      digit1:[''],
      digit2:[''],
      digit3:[''],
      digit4:[''],
      
    }
   );
  }
  verifyEmail(){
    if(this.emailVerficationForm.valid && this.emailVerficationForm.dirty){
      this.email=this.emailVerficationForm.controls['email'].value
      this.subs.add(this.http.postReq('api/auth/forgot/password',this.emailVerficationForm.value).subscribe({
        next:res=>{
    
        },complete:()=>{
          this.step=2
    
        }
      }))

    }
    else{
      this.emailVerficationForm.markAllAsTouched()
    }
  }
  dispalyErorr=false
  ValidateOTP(){
    this.code=this.verificationForm.controls['digit1'].value+this.verificationForm.controls['digit2'].value+this.verificationForm.controls['digit3'].value+this.verificationForm.controls['digit4'].value
    let body={
      'email':this.email,
      'code':this.code
    }
    if(this.verificationForm.valid && this.verificationForm.dirty){
      this.subs.add(this.http.postReq('api/auth/verify/code/password',body).subscribe({
        next:res=>{
  
        },complete:()=>{
          this.step=3
        }
      }))

    }
    else{
      this.dispalyErorr=true
    }
  }


  changePassword(){
    if(this.resetPasswordFrorm.valid && this.resetPasswordFrorm.dirty){
      let body={
        'email':this.email,
        'code':this.code,
        'password':this.resetPasswordFrorm.controls['new_password'].value,
        'password_confirmation':this.resetPasswordFrorm.controls['new_password_confirmation'].value
      }
      this.subs.add(this.http.postReq('api/auth/reset/password',body).subscribe({
        next:res=>{
    
        },complete:()=>{
          this.router.navigate(['/auth/login'])
        }
      }))

    }else{
      this.resetPasswordFrorm.markAllAsTouched()
    }
    
  }

  onPaste(event: ClipboardEvent) {
    // Handle the paste event logic here
    const pastedText = event.clipboardData?.getData('text');
    if(pastedText && pastedText.length==4){
     const field1 = document.getElementById('digit1') as HTMLInputElement;
     const field2 = document.getElementById('digit2') as HTMLInputElement;
     const field3 = document.getElementById('digit3') as HTMLInputElement;
     const field4 = document.getElementById('digit4') as HTMLInputElement;
     field1.value=pastedText[0]
     field2.value=pastedText[1]
     field3.value=pastedText[2]
     field4.value=pastedText[3]
     this.verificationForm.controls['digit1'].setValue(pastedText[0])
     this.verificationForm.controls['digit2'].setValue(pastedText[1])
     this.verificationForm.controls['digit3'].setValue(pastedText[2])
     this.verificationForm.controls['digit4'].setValue(pastedText[3])
    }

    this.blurAllInputs()
  }

  blurAllInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => this.renderer.selectRootElement(input).blur());
  }

}
