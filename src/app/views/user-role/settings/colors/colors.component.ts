import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements OnInit {
  private subs=new Subscription()
  formDataPayLoad1 = new FormData();
  logoImage:any
  invoiceColor:any
  dashboardColor:any
  mainBtn:any
  secondaryBtn:any
  PrevInvoiceColor:any
  prevDashboardColor:any
  prevMainBtn:any
  prevSecondaryBtn:any
  constructor(private http:HttpService,private changeLabg:ChangeLanguageService,private router:Router,private toastr:ToastrService) { }
  language:any
  ngOnInit() {
    this.language=this.changeLabg.local_lenguage
    // this.getUserExistingData();
    this.getColors();
  }

  getColors(){
    this.subs.add(this.http.getReq('api/dashboard/settings/colors').subscribe({
      next:res=>{
        if(res?.data?.media?.logo){
          this.logoImage=res?.data?.media?.logo
         }
          this.mainBtn=res?.data?.button_primary_color
          this.prevMainBtn=res?.data?.button_primary_color
          this.secondaryBtn=res?.data?.button_secondary_color
          this.prevSecondaryBtn=res?.data?.button_secondary_color
          this.prevDashboardColor=res?.data?.website_color
          this.dashboardColor=res?.data?.website_color
          this.invoiceColor=res?.data?.invoice_color
          this.PrevInvoiceColor=res?.data?.invoice_color
         
      }
     }))
  }
  getUserExistingData(){
    this.subs.add(this.http.getReq('api/dashboard/account/profile').subscribe({
     next:res=>{
      if(res?.data?.media?.logo){
       this.logoImage=res?.data?.media?.logo
      }
       this.mainBtn=res?.data?.button_primary_color
       this.prevMainBtn=res?.data?.button_primary_color
       this.secondaryBtn=res?.data?.button_secondary_color
       this.prevSecondaryBtn=res?.data?.button_secondary_color
       this.prevDashboardColor=res?.data?.website_color
       this.dashboardColor=res?.data?.website_color
       this.invoiceColor=res?.data?.invoice_color
       this.PrevInvoiceColor=res?.data?.invoice_color
      

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
      this.subs.add(this.http.postReq('api/dashboard/settings/upload',this.formDataPayLoad1).subscribe({
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
updateColors(){
if(this.mainBtn != this.prevMainBtn || 
  this.invoiceColor != this.PrevInvoiceColor || 
  this.secondaryBtn != this.prevSecondaryBtn || 
  this.dashboardColor != this.prevDashboardColor){

     let body={
        'invoice_color':this.invoiceColor,
        'website_color':this.dashboardColor,
        'button_primary_color':this.mainBtn,
        'button_secondary_color':this.secondaryBtn
      }

    this.subs.add(this.http.putReq('api/dashboard/settings/colors',body).subscribe({
    next:res=>{
      
    },complete:()=>{
      if(this.language=='en'){
        this.toastr.info('Data Updated successfully')
      }
      else{
        this.toastr.info('تم تحديث البيانات بنجاح.')
      }
     if(localStorage.getItem('secondaryColor')){
      localStorage.removeItem('secondaryColor')
      localStorage.setItem('secondaryColor',this.secondaryBtn)
     }
     if(localStorage.getItem('primaryColor')){
      localStorage.removeItem('primaryColor')
      localStorage.setItem('primaryColor',this.mainBtn)
     }
     if(localStorage.getItem('dashboardColor')){
      localStorage.removeItem('dashboardColor')
      localStorage.setItem('dashboardColor',this.dashboardColor)
     }
     if(localStorage.getItem('invoiceColor')){
      localStorage.removeItem('invoiceColor')
      localStorage.setItem('invoiceColor',this.invoiceColor)
     }
     window.location.reload()
    }
    }))

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
