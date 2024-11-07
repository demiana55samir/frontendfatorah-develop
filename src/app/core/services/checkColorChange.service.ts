import { Injectable, OnDestroy } from '@angular/core';
import { HttpService } from './http.service';
import { Subscription, interval, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckColorChangeService  {
constructor(private http:HttpService) { }
private subscription=new Subscription();

private alive = true;
getUserColors(){
  return this.http.getReq('api/dashboard/settings/colors');
}

checkColorChange(){
this.subscription.add(
  interval(10 * 1000 /* 10 seconds */)
  .pipe(takeWhile(() => this.alive)) // only fires when component is alive
  .subscribe(() => {
    this.getUserColors().subscribe(data => {
      if(localStorage.getItem('secondaryColor')){
        if(localStorage.getItem('secondaryColor') != data.button_secondary_color){
          localStorage.removeItem('secondaryColor')
          localStorage.setItem('secondaryColor',data.button_secondary_color)
        }
      }
      if(localStorage.getItem('primaryColor')){
        if(localStorage.getItem('primaryColor') != data.button_primary_color){
          localStorage.removeItem('primaryColor')
          localStorage.setItem('primaryColor',data.button_primary_color)
        }
      }
      if(localStorage.getItem('invoiceColor')){
        if(localStorage.getItem('invoiceColor') != data.invoice_color){
          localStorage.removeItem('invoiceColor')
          localStorage.setItem('invoiceColor',data.invoice_color)
        }
      }
      if(localStorage.getItem('dashboardColor')){
        if(localStorage.getItem('dashboardColor') != data.website_color){
          localStorage.removeItem('dashboardColor')
          localStorage.setItem('dashboardColor',data.website_color)
        }
      }
    
    });
  })
)

}
destroy(){
  this.alive = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
}
}

