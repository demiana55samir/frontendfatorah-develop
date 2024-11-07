import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { OwlCarouselComponent } from '@modules/owl-carousel/owl-carousel.component';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { Download_pdfService } from '@services/download_pdf.service';
import { HttpService } from '@services/http.service';
import { PaymentService } from '@services/payment.service';
import { ValidationService } from '@services/validation.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'primeng/card';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subscriptionAndPayment',
  templateUrl: './subscriptionAndPayment.component.html',
  styleUrls: ['./subscriptionAndPayment.component.scss']
})
export class SubscriptionAndPaymentComponent implements OnInit {
  private subs=new Subscription()
  paymentCards=1
  remainingPercent:any
  timeDifferenceDays:any
  payAmount:any
  invoiceDetailsForm!:FormGroup
  cards:any=[]
  invoices:any=[]
  downloadedInvoice:any
subscription:any
invoiceColor:string=''
default_template_id:number=0
cities:any
user:any
prevdata:any
country:any
enableCode:any=true;

AutoRenewForm!:FormGroup;
NewCardForm!:FormGroup;
  primaryColor:any = '';
  constructor(private router:Router,private changeLanguage:ChangeLanguageService,
    private http:HttpService,private fb:FormBuilder,private paymentService:PaymentService,
    private httpClient: HttpClient, private route : ActivatedRoute,
    private validationService : ValidationService,
    private toastr:ToastrService,private download_pdfService:Download_pdfService) { 

      document.addEventListener('keydown', function(e) {
        if (e.key === 'PrintScreen') {
            alert('Screenshots are not allowed!');
        }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
          alert('Screenshots are disabled.');
          navigator.clipboard.writeText(''); // Clears the clipboard
      }
  });
      const queryParams = this.route.snapshot.queryParams;
      let paramString = '';
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          paramString += `${key}=${queryParams[key]}&`;
        }
      }
      // Remove the last '&' character
      paramString = paramString.slice(0, -1);
     
      
      if(queryParams['id']){
        this.storeCard(queryParams)
      }
    }
  language:any
  ngOnInit() {
    this.customOptions = { ...this.customOptions, loop: false }
    if( localStorage.getItem('primaryColor') ){
      this.primaryColor = localStorage.getItem('primaryColor');
    }
    this.language=this.changeLanguage.local_lenguage
    this.invoiceColor=String(localStorage.getItem('invoiceColor'))
    this.default_template_id=Number(localStorage.getItem('default_template_id'))
    this.getSubscriptionAndPayment()
    this.getPrevInvoices()
    this.getcities()
    this.getCards()
    this. getUserData()
    this.country='KSA'
    this.invoiceDetailsForm=this.fb.group({
      name:['',Validators.required],
      email:['',Validators.compose([Validators.required,Validators.email])],
      address:[''],
      city_id :['',Validators.required],
      tax_number:['']
    })

    this.AutoRenewForm=this.fb.group({
      is_enable: ['',Validators.required]
    })

    let frontBaseURL = environment.frontBaseUrl;

    this.NewCardForm=this.fb.group({
      number: ['',[Validators.required,Validators.maxLength(16),Validators.minLength(15), Validators.pattern('^[0-9]*$')]],
      name: ['',[Validators.required , Validators.pattern(this.validationService.textOnly) , this.validationService.twoWordsValidator()]],
      month: ['',[Validators.required,Validators.maxLength(2),Validators.minLength(1), Validators.pattern('^[0-9]*$'),this.validationService.monthValidator()]],
      year: ['',[Validators.required,Validators.maxLength(4),Validators.minLength(2), Validators.pattern('^[0-9]*$')]],
      cvc: ['',[Validators.required,Validators.maxLength(4),Validators.minLength(3), Validators.pattern('^[0-9]*$')] ],
      callback_url: [`${frontBaseURL}/user/Subscription/subscription-payment`, Validators.required],
      // ​publishable_api_key:['pk_test_Z23DgkecvN8CXCmk3kTsipZUAGySFLFxEd3k4ucp', Validators.required]
    })

  
    if(this.language == 'ar'){
      this.customOptions.rtl=true
    }
    else{
      this.customOptions.rtl=false
    }
    setTimeout(() => {
      this.owl = true
    }, 200);
  }
 
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {

    if (event.key === 'PrintScreen') {
      alert('Screenshots are disabled for this content!');
      event.preventDefault();
    }
  }
 

  getcities(){
    this.subs.add(this.http.getReq('api/dashboard/settings/cities').subscribe({
      next:res=>{
    this.cities=res.data.data
      }
    }))
  }

  planCreatedAt ='';
  planEndAt ='';
  CardDefault:string = '';
  getUserData(){
    this.http.getReq('api/dashboard/settings/general').subscribe({
      next:res=>{
          this.user=res.data;
          this.CardDefault = this.user?.default_card;   
          
          this.autoRenewVal = this.user?.subscription_auto_renewal;       
          this.invoiceDetailsForm.patchValue(this.user)
          localStorage.setItem('UserObj', JSON.stringify(res.data));
          this.invoiceDetailsForm.controls['city_id'].setValue(this.user.city.id)
          this.prevdata=this.invoiceDetailsForm.value
          if(this.invoiceDetailsForm.controls['tax_number'].value){
            this.enableCode=false
          }

          if(this.user?.plan){
            this.plan_id = this.user?.plan?.id;
            this.planAmount = this.user?.plan?.price;
            this.planDes = this.user?.plan?.description;
            
            this.durationID = this.user?.plan?.duration_id;
            this.subscription_type = this.user?.plan?.slug;

          }

          if(this.user?.check_subscription){
            this.planCreatedAt = this.user?.check_subscription?.starts_at;
            this.planEndAt = this.user?.check_subscription?.ends_at;
          }
      }
     })
  }
  getSubscriptionAndPayment(){
    this.subs.add(this.http.getReq('api/dashboard/account/subscriptions').subscribe({
      next:res=>{
         this.subscription=res.data
      //     this.cards=res.data.user_cards
      //     this.cards.forEach((element:any) => {
      //       this.cards.push(element)
      //     });
 
     
         //get subscription progress data 
         this.remainingPercent=(res.data.remaining_days/res.data.subscription_days)*100
          //get payment amount 
          if(res.data.monthly_bill_due){   
            const parts = res.data.monthly_bill_due?.split(" ");
            this.payAmount=parseInt(parts[0]);
          }
      }
    }))
  }
  getCards(){
    this.cards = [];
    this.subs.add(this.http.getReq('api/dashboard/cards').subscribe({
      next:res=>{
        this.cards=res.data;
       
        // this.changeOptions()
      },complete:()=> {
 
      }

    }))
  }
  getPrevInvoices(){
    this.subs.add(this.http.getReq('api/dashboard/subscriptions/index').subscribe({
      next:res=>{
        this.invoices=res.data
      }
    }))
  }
  setDownloadedInvoice(uuid:any){

    this.download_pdfService.downloadSubscriptionsInvoice(uuid)

    // this.subs.add(this.http.getReq(`api/dashboard/subscriptions/${uuid}/invoice`).subscribe({
    //   next:res=>{
    //     this.downloadedInvoice=res.data
    //   },complete:()=>{
    //     this.downloadPdf()
    //   }
    // }))
  }

  downloadBoo=false
@ViewChild('downloadBtn') downloadBtn!: ElementRef<HTMLElement>;
downloadPdfBtn() {
    let el: HTMLElement = this.downloadBtn.nativeElement;
    el.click();
}
downloadPdf(){
   this.downloadBoo = true ;
   setTimeout(() => {
    this.downloadPdfBtn()
   }, 300);
  }


  cancleEdit(){
    this.invoiceDetailsForm.patchValue(this.prevdata)
  }
  submitForm(){
    if(this.invoiceDetailsForm.valid){
      if(JSON.stringify(this.invoiceDetailsForm.value) != JSON.stringify(this.prevdata)){
        this.subs.add(this.http.putReq('api/dashboard/account/details',this.invoiceDetailsForm.value).subscribe({
         next:res=>{

         },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Data Updated successfully')
          }
          else{
            this.toastr.info('تم تحديث البيانات بنجاح.')
          }
           this.prevdata=this.invoiceDetailsForm.value
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
    else{
      this.invoiceDetailsForm.markAllAsTouched()
    }
  }

  payment_link:string='';
  durationID:number = -1;
  subscription_type:string = '';
  plan_id:number = 0;
  planAmount:number = 0;
  planDes:string = ''
  renewSubscription(){

    this.initiateSubscription(this.planAmount,this.planDes,this.plan_id);
    // let params={
    //   'duration_id':this.durationID,
    //   'subscription_type':this.subscription_type,
    //   'with_trial': 0
    // }
    // this.subs.add(this.http.getReq(`api/dashboard/subscriptions/${this.plan_id}/subscribe`,{params:params}).subscribe({
    //   next:res=>{
    //     this.payment_link=res.data;
    //     if(res?.status == 'trial'){
    //       this.toastr.success(res?.message)
    //       this.router.navigate(['/user/Subscription/subscription-payment'])
    //     }
    //    else if(res?.status == 'subscribe'){
    //     window.open(this.payment_link, '_blank');
    //   }
    //   },complete:()=> {
    //   }
    // }))
  }


  initiateSubscription(amount:number,description:string,plan_id:number){
   
    this.paymentService.set_amount(amount)
    
    this.paymentService.set_description(description)
    this.paymentService.set_plane_id(plan_id)

    this.router.navigate(['/user/Subscription/make-payment'])
    

  }


  // new credit cards
  customOptions: OwlOptions = {
    loop: false,
    nav: true,
    navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
    items: 3,
    dots: false,
    autoplay: false,
    center : false,
    mouseDrag:false,
    pullDrag:false,
  responsive: {
    0: {
      items: 1,
    },
    450: {
      items: 1,
    },
    675: {
      items: 1,
    },
    900: {
      items: 2,
    },
    1024:{
      items:3
    }
  },
  };

owl = false;
@HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.owl = false;
    setTimeout(() => {
      this.owl = true
    }, 200);
  }

  autoRenewVal:any
  changeAutoRenew(e:any){
    let body = {
      auto_renew:this.autoRenewVal
    }
    this.subs.add(this.http.putReq('api/dashboard/account/auto-renew',body).subscribe({
      next:res=>{
       
      },complete:()=>{
        if(this.autoRenewVal == 1){
          if(this.language=='en'){
            this.toastr.info('Auto-Renewal Enabled Successfully for Your Account')
          }
          else{
            this.toastr.info('تم تفعيل التجديد التلقائي بنجاح لحسابك')
          }
        }else{
          if(this.language=='en'){
            this.toastr.info('Auto-Renewal Disabled for Your Account')
          }
          else{
            this.toastr.info('تم تعطيل التجديد التلقائي لحسابك')
          }
        }
      },
      error:()=>{
        this.autoRenewVal = this.user?.subscription_auto_renewal;  
      }
     }))
  }

  deleteCard(cardId:number){
    this.subs.add(this.http.deleteReq(`api/dashboard/cards/${cardId}`).subscribe({
      next:res=>{
       
        this.cards  =  this.cards.filter((card:any) => card.id != cardId)
      },complete:()=>{
       if(this.language=='en'){
         this.toastr.info('Card Deleted successfully')
       }
       else{
         this.toastr.info('تم حذف البطاقة بنجاح.')
       }
        this.prevdata=this.invoiceDetailsForm.value
      }
     }))
  }
  SetDefaultCard(cardId:number){
    this.subs.add(this.http.putReq(`api/dashboard/cards/${cardId}`).subscribe({
      next:res=>{
        this.cards.forEach((card:any) => {
          if(card?.id == cardId){
            card.is_default = 1;
            this.CardDefault = card.masked_pan
          }else{
            card.is_default = 0;
          }
        });
      },complete:()=>{
       if(this.language=='en'){
         this.toastr.info('Data Updated successfully')
       }
       else{
         this.toastr.info('تم تحديث البيانات بنجاح.')
       }
        this.prevdata=this.invoiceDetailsForm.value
      }
     }))
  }
  getBackgroundImage(cardBand: string): string {
    switch(cardBand) {
      case 'master':
        return 'url(./assets/images/subscription/masterNoData.png)';
      case 'visa':
        return 'url(./assets/images/subscription/visaNoData.png)';
      case 'mada':
        return 'url(./assets/images/subscription/MadaCardCropped.png)';
      case 'amex':
        return 'url(./assets/images/subscription/AMCardCropped.png)';
      default:
        return '';
    }
  }

  addNewCard(){
    if (this.NewCardForm.valid) {
      const headers = new HttpHeaders({
        'Authorization': 'Basic ' + btoa(environment.publishable_api_key+':')
      });

      this.httpClient.post('https://api.moyasar.com/v1/tokens', this.NewCardForm.value, { headers })
        .subscribe({
          next:response=>{
            setTimeout(() => {
              this.createUserCard(response)
              // window.location.href = response.verification_url;
            }, 200);
          }
        })
       
    }else{
      this.NewCardForm.markAllAsTouched();
      this.changeLanguage.scrollToInvalidInput(this.NewCardForm);
    } 
  }

  createUserCard(Payment_Response:any){
    this.subs.add(this.http.postReq(`api/dashboard/cards/createUserCard`,Payment_Response).subscribe({
      next:res=>{
        window.location.href = Payment_Response.verification_url;
      },
      error:(err)=>{
        this.toastr.error(err)
      }
    }))
  }
  storeCard(paramsString:any){
   
    this.subs.add(this.http.postReq(`api/dashboard/cards/store`,paramsString).subscribe({
      next:res=>{
        if(res?.exists_card == 0){
          this.cards.push(res.data);
        }

        if(this.language=='ar'){
          this.toastr.success('تم الاضافة بنجاح')
        }
        else{
          this.toastr.success('Added successfully')
        }

        this.router.navigate(['/user/Subscription/subscription-payment'], {queryParams: {}});

      },
      error:(err)=>{
        // this.toastr.error(err)
        this.router.navigate(['/user/Subscription/subscription-payment'], {queryParams: {}});
      }
    }))
  }
}
