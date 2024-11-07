import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-step2',
  templateUrl: './register-step2.component.html',
  styleUrls: ['./register-step2.component.scss']
})
export class RegisterStep2Component implements OnInit , OnDestroy{
  verificationForm!:FormGroup
  private subs=new Subscription()


  remainingSeconds = 0;
  constructor(private formBuilder:FormBuilder,private changeLang:ChangeLanguageService,private router:Router,
    private http:HttpService,private renderer: Renderer2,private toastr:ToastrService
    ) { }
  
  language:any
  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.verificationForm = this.formBuilder.group({
      digit1:[''],
      digit2:[''],
      digit3:[''],
      digit4:[''],
      
    }
   );
   let firstField = document.getElementById('digit1');
   if (firstField) {
     firstField.focus();
   }
  }
displayError=false
  otpCheck(){
   let code=this.verificationForm.controls['digit1'].value+this.verificationForm.controls['digit2'].value+this.verificationForm.controls['digit3'].value+this.verificationForm.controls['digit4'].value
  if(this.verificationForm.valid && this.verificationForm.dirty){
    let body={
       'verification_code':code
     }
     this.subs.add(this.http.postReq('api/auth/verify',body).subscribe({
       next:res=>{
 
       },complete:()=>{
         this.router.navigate(['/auth/register-step3'])
       }
     }))
  }
  else{
    this.displayError=true
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

  reSendCode(){
    this.subs.add(this.http.getReq('api/auth/resend/code').subscribe({
      next:res=>{
        this.toastr.success(res.message)
        this.remainingSeconds = 60;
        this.startTimer();
      }
    }))
  }

  startTimer() {
    const timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
      } else {
        clearInterval(timerInterval); // Stop the timer when it reaches 0 seconds
      }
    }, 1000); // Update the timer every 1000 milliseconds (1 second)
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
