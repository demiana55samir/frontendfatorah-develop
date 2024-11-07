import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss']
})
export class LandingFooterComponent implements OnInit {
language:any
mailingForm!:FormGroup
private subs= new Subscription()
email='info@fatorah-pro.com'
whatsapp:any
facebook:any
twitter :any
  constructor(private changelngServ:ChangeLanguageService,private fb:FormBuilder,private http:HttpService,private toastr:ToastrService) { }

  ngOnInit() {
    this.getTermsAndConditions()
   this.whatsapp=localStorage.getItem('whatsapp')
   this.facebook =localStorage.getItem('facebook')
   this.twitter = localStorage.getItem('twitter')
 
    this.language=this.changelngServ.local_lenguage
    this.mailingForm=this.fb.group({
      email:['',Validators.required]
    })
  }
  subscribeMailing(){
    if(this.mailingForm.valid && this.mailingForm.dirty){
      this.subs.add(this.http.postReq('api/newsletter',this.mailingForm.value).subscribe({
        next:res=>{
        
        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Email Sended Sucessfully')
          }
          else{
            this.toastr.info('تم إرسال البريد الإلكتروني بنجاح')
          }
          this.mailingForm.reset()
        }
      }))

    }
    else{
      this.mailingForm.markAllAsTouched()
    }
  }
  openWhatsApp() {
    const phoneNumber = this.whatsapp; // Replace with the desired phone number
    const whatsappUrl =`https://wa.me/${phoneNumber}`;
  
    window.open(whatsappUrl, '_blank');
  }
  openFacebook() {  
    window.open(this.facebook, '_blank');
  }
  openTwitter() {  
    window.open(this.twitter, '_blank');
  }


  termsAndCondtions:any
  getTermsAndConditions(){
    this.subs.add(this.http.getReq('api/terms_and_conditions').subscribe({
      next:res=>{
        this.termsAndCondtions=res.data
      }
    }))
  }

}
