import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var Moyasar: any; // Declare Moyasar for TypeScript
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  //setters and getters for amount
  public get_amount(): number{
      return Number(localStorage.getItem('subscription_amount'))
  }
  public set_amount(value:number){
    localStorage.setItem('subscription_amount',String(value))
  }

  //setters and getters for description
  public get_description(): string{
    return String(localStorage.getItem('subscription_description'))
}
  public set_description(value:string){
    localStorage.setItem('subscription_description',String(value))
  }

  //setters and getters for description
  public get_plan_id(): number{
    return Number(localStorage.getItem('subscription_plan_id'))
}
  public set_plane_id(value:number){
    localStorage.setItem('subscription_plan_id',String(value))
  }

  public get_user_id(): number{
    const userId = this.authService.getUserObj().id
    return Number(userId)
}

  remove_subscription_value(){
    localStorage.removeItem('subscription_plan_id')
    localStorage.removeItem('subscription_description')
    localStorage.removeItem('subscription_amount')
  }


  constructor(private http:HttpService,
    private httpClient: HttpClient,
    private authService:AuthService) {}
  //function to initiat payment 
  initiatePayment() {
    let frontBaseURL = environment.frontBaseUrl;
    let baseUrl = environment.baseUrl;
    Moyasar.init({
      element: '.mysr-form',
      amount: this.get_amount() * 100, // Amount in cents
      currency: 'SAR',
      description: 'For Subscription' +' '+ this.get_description(),
      publishable_api_key: environment.publishable_api_key,
      // callback_url: `https://fat-b.restart-technology.com/api/dashboard/subscriptions/${this.get_plan_id()}/${this.get_user_id()}/callbackMoyasr`, // Replace with your callback URL
      // callback_url: `https://fat-f.restart-technology.com/user/Subscription/change-plan?PLANID=${this.get_plan_id()}&USERID=${this.get_user_id()}`, // Replace with your callback URL
      callback_url: `${frontBaseURL}/user/Subscription/change-plan?plan_id=${this.get_plan_id()}`, // Replace with your callback URL
      methods: ['creditcard'],
      language: localStorage.getItem('currentLang'), // localization ar or en
      fixed_width: false, // optional, only for demo purposes
      credit_card: {
        save_card: true
      },
    
      // on_initiating: function () {
      //   return {};
      // },
      // on_completed: `${baseUrl}subscriptions/onComplete`,
      // on_completed: this.http.postReq(`api/dashboard/subscriptions/onComplete`),
      on_completed:  (payment:any)=> {
        return new Promise<void>( (resolve, reject) => {
          if(payment.source.token){
            console.log(payment);
            this.http.postReq(`api/dashboard/subscriptions/${this.get_plan_id()}/onComplete`,payment).subscribe({
              next:res=>{
                resolve();
              }
            })
          }else{
            reject()
          }
            
        })
      },
    
      on_error: (error: any) => {
        console.error('Payment error', error);
      },
    });
  }

  paymentCompleted(response: any): void {
    console.log('Payment completed successfully:', response);
   
      const headers = new HttpHeaders({
        'Authorization': 'Basic ' + btoa(environment.publishable_api_key+':')
      });

      this.httpClient.post('https://mystore.com/checkout/savepayment', { headers })
        .subscribe((response: any) => {
          console.log('Payment Token Response:', response);
          setTimeout(() => {
            
            window.location.href = response.verification_url;
          }, 0);
        }, error => {
          console.error('Error:', error);
        });
  
  }
}
