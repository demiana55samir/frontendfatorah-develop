import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralUserDataService {
user:any
primaryColor:any
secondaryColor:any
constructor(private http:HttpService) { }

getuser(){
  this.getUserGaneralData()
  return this.user
}


getUserGaneralData(){
   this.http.getReq('api/dashboard/settings/general').subscribe({
    next:res=>{
        this.user=res.data
        localStorage.setItem('primaryColor',res.data.button_primary_color)
        localStorage.setItem('secondaryColor',res.data.button_secondary_color)
        localStorage.setItem('dashboardColor',res.data.website_color)
        localStorage.setItem('invoiceColor',res.data.invoice_color)
        
    }
   })
   return this.user
}

getPrimaryBtnColor(){
   return this.user.button_primary_color
}


}
