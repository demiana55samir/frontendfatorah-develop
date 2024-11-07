import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logo-and-seal',
  templateUrl: './logo-and-seal.component.html',
  styleUrls: ['./logo-and-seal.component.scss']
})
export class LogoAndSealComponent implements OnInit {
  hide:boolean=false
  private subs=new Subscription()
  formDataPayLoad1 = new FormData();
  formDataPayLoad2 = new FormData();
  logoImage:any
  sealImage:any

  constructor(private http:HttpService,private auth:AuthService,private changeLang:ChangeLanguageService,private router:Router,private toastr:ToastrService) { }
  language:any
  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.getUserExistingData()
  }

  getUserExistingData(){
     this.subs.add(this.http.getReq('api/dashboard/account/profile').subscribe({
      next:res=>{
       if(res?.data?.media?.logo){
        this.logoImage=res?.data?.media?.logo
       }
       if(res?.data?.media?.signature){
        this.sealImage=res?.data?.media?.signature
       }
       if(res?.data?.filgrane==1){
        this.hide=true
       }
       else{
        this.hide=false

       }
      }
     }))
  }

  validateLogo(event:any) {
    this.formDataPayLoad1.delete('logo')
    let reader = new FileReader();
    const file:File = event.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
        reader.onload = () => {
          this.logoImage = reader.result;
        }
        this.formDataPayLoad1.append("logo", file);
        let url:any=''
        this.subs.add(this.http.postReq('api/dashboard/settings/upload',this.formDataPayLoad1).subscribe({
          next:res=>{
            url=res.data.logo

          },complete:()=>{
            let userobj=this.auth.getUserObj()
            userobj.media.logo=url
            localStorage.setItem('UserObj',JSON.stringify(userobj))

            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
          }
       }))
    }
  }
  
  validateSeal(event:any) {
    this.formDataPayLoad2.delete('signature')
    let reader = new FileReader();
    const file:File = event.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
        reader.onload = () => {
          this.sealImage = reader.result;
        }
        this.formDataPayLoad2.append("signature", file);
        let url:any=''
        this.subs.add(this.http.postReq('api/dashboard/settings/upload',this.formDataPayLoad2).subscribe({
          next:res=>{
            url=res.data.signature
          },complete:()=>{
            let userobj=this.auth.getUserObj()
            userobj.media.signature=url
            localStorage.setItem('UserObj',JSON.stringify(userobj))

            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
          }
       }))
    }
  }

  removeMedia(type:string){
    let body={
      collection_name:type
    }
    this.subs.add(this.http.postReq('api/dashboard/settings/clearMediaCollection',body).subscribe({
    next:res=>{
      
    },complete:()=>{
    if(type=='logo'){
      this.logoImage=''
      let userobj=this.auth.getUserObj()
      userobj.media.logo=''
      localStorage.setItem('UserObj',JSON.stringify(userobj))
    }
    else{
      this.sealImage=''
      let userobj=this.auth.getUserObj()
      userobj.media.signature=''
      localStorage.setItem('UserObj',JSON.stringify(userobj))
    }
    if(this.language=='en'){
      this.toastr.info('Data Updated successfully')
    }
    else{
      this.toastr.info('تم تحديث البيانات بنجاح.')
    }
    }
    }))
  }

  updateSignature(){
    this.hide=!this.hide;
    let body={
      'filgrane':this.hide
    }
    this.subs.add(this.http.putReq('api/dashboard/account/filgrane',body).subscribe({
      next:res=>{

      },complete:()=>{
        let user=this.auth.getUserObj()
        if(this.hide==true){
          user.filgrane=1
        }
        else{
          user.filgrane=0
        }
        localStorage.setItem('UserObj',JSON.stringify(user))
        if(this.language=='en'){
          this.toastr.info('Data Updated successfully')
        }
        else{
          this.toastr.info('تم تحديث البيانات بنجاح.')
        }
      }
    }))
  }

}
