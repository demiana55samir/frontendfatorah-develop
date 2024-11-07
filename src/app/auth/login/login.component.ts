import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showPassword!: boolean;
  showPasswordOnPress!: boolean;
  value=''
  loginForm!:FormGroup
  rememberMe:any
  subs=new Subscription()

  constructor(private http:HttpService,private changeLang:ChangeLanguageService,private authSer:AuthService,private fb:FormBuilder,private router:Router) { }
  language:any

  ngOnInit() {
    localStorage.removeItem('UserToken');
    localStorage.removeItem('UserObj');
    
    this.language=this.changeLang.local_lenguage
    this.loginForm=this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required],
      rememberMe:[''],
      fatorah_version:1
    })
  }
  login(){
    this.rememberMe=this.loginForm.controls['rememberMe'].value
    this.loginForm.removeControl('rememberMe');

    if(this.loginForm.valid && this.loginForm.dirty){
      this.subs.add(this.http.postReq('api/auth/login',this.loginForm.value).subscribe({
        next:res=>{
          // console.log(res);
          this.authSer.setUserToken(res?.access_token);   
          this.authSer.setUserObj(res?.user);

          if(!res?.user?.is_verified)  this.router.navigate(['/auth/register-step2'])
          else if(!res?.user?.is_completed)  this.router.navigate(['/auth/register-step3'])
          else{
           
            localStorage.setItem('default_template_id',res?.user.default_template_id)
            localStorage.setItem('primaryColor',res.user.button_primary_color)
            localStorage.setItem('secondaryColor',res.user.button_secondary_color)
            localStorage.setItem('dashboardColor',res.user.website_color)
            localStorage.setItem('invoiceColor',res.user.invoice_color)
            localStorage.setItem('logo',res.user.media.logo)

            if(res?.user.role=='user'){
              this.router.navigate(['/user/control/dashboard'])
            }
            else{
              this.router.navigate(['/admin/control/dashboard'])
            }
          }
          // return;

        },complete:()=>{
          if(this.rememberMe==true){
            localStorage.setItem("RememberMe",this.rememberMe)
          }
          else{
            this.rememberMe=false
            localStorage.setItem("RememberMe",this.rememberMe)
          }
        },error:()=>{
          const newFormControl = new FormControl('');
          this.loginForm.addControl('rememberMe',newFormControl); 
          this.loginForm.controls['rememberMe'].setValue(this.rememberMe)
        }
      }))
    }
    else{
      this.loginForm.markAllAsTouched()
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }


}
