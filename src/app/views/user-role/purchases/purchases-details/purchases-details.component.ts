import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { payment, purchase } from '@modules/purchase';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { CopyContentService } from '@services/copy-content';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-purchases-details',
  templateUrl: './purchases-details.component.html',
  styleUrls: ['./purchases-details.component.scss']
})
export class PurchasesDetailsComponent implements OnInit {
  purchaseUuid:any
  purchase:purchase = {} as purchase;
  sendToClientForm!:FormGroup
  private subs=new Subscription()
  type:any
  disableEmail=false
  htmlPage: any;
  viewOnly=true


  purchase_types = [
    {
      id: 1,
      img: './assets/images/invoices/Tax_invoice.svg',
      name_ar: ' مشترى بفاتورة ',
      name_en: ' Purchase with invoice',
    },
    {
      id: 0,
      img: './assets/images/invoices/Non-tax_invoice.svg',
      name_ar: ' مصروف ',
      name_en: ' Expense ',
    },
  ];
  invoices_types = [
    {
      id: 1,
      img: './assets/images/invoices/Tax_invoice.svg',
      name_ar: ' ضريبية',
      name_en: 'Tax invoice',
    },
    {
      id: 0,
      img: './assets/images/invoices/Non-tax_invoice.svg',
      name_ar: ' غير ضريبية',
      name_en: 'Non-tax invoice',
    },
  ];

  imported_types = [
    {
      id: 1,
      img: './assets/images/purchases/file-arrow-left.svg',
      name_ar: ' مستوردة',
      name_en: 'Imported',
    },
    {
      id: 0,
      img: './assets/images/purchases/file-text.svg',
      name_ar: ' غير مستوردة',
      name_en: 'Not imported',
    },
  ];
  language: any;
  addedPayments: payment[] = [
    {
      name: {
        ar: '',
        en: '',
      },
      paid_amount: 0,
      converted_amount: 0,
    },
  ];
  paymentForm!:FormGroup;
  constructor(private http:HttpService, private router:Router,
    private copier:CopyContentService,private fb:FormBuilder,
    private changeLang: ChangeLanguageService, private validationserv:ValidationService,
    private activeRoute:ActivatedRoute,private toastr:ToastrService) { }

  ngOnInit() {
    this.language = this.changeLang.local_lenguage;
    this.purchaseUuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
    this.type= String(this.activeRoute.snapshot.paramMap.get('type'))
    if(this.router.url.includes('/viewOnly')){
      this.viewOnly=false
      if(this.type=='cancelled'){
      this.getCancelledPurchas('viewOnly')
      }
      else{
        this.getPurchas('viewOnly')
      }

    }
    else{
      this.viewOnly=true
      if(this.type=='cancelled'){
        this.getCancelledPurchas('view')
        }
        else{
          this.getPurchas('view')
        }  
    }

    this.sendToClientForm=this.fb.group({
      email:['',Validators.required]
    })

    this.paymentForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.compose([Validators.required])],
        en: ['',Validators.compose([Validators.required])] 
      }),
      paid_amount:['',Validators.required],
      converted_amount:['',Validators.required],
      purchasing_uuid:['',Validators.required]
    })
    
  }

  getPurchas(type:any){
    let url=''
    if(type=='viewOnly'){
      url=`api/purchasing/${this.purchaseUuid}/preview`
    }
    else{
      url=`api/dashboard/purchasings/${this.purchaseUuid}`
    }
    this.subs.add(this.http.getReq(url).subscribe({
      next:res =>{
        this.purchase=res.data;
        this.purchase.unpaid_converted = Number(this.purchase.unpaid_converted ?.toFixed(2))
        this.purchase.remaining_amount = Number(this.purchase.remaining_amount ?.toFixed(2))
        if(this.purchase.payments){
          this.addedPayments = this.purchase.payments;
        }
        
      },complete:()=>{
        setTimeout(()=>{
         
          if(type=='viewOnly'){
          this.download()}
        },400)
      }
    }))
  }
  perchases:any
  getCancelledPurchas(type:any){
    let url=''
    if(type=='viewOnly'){
        url=`api/deleted/purchasing/${this.purchaseUuid}/preview`
    }
    else{
      url='api/dashboard/deleted/purchasings'
    }
    this.subs.add(this.http.getReq(url).subscribe({
      next:res =>{
        if(type != 'viewOnly'){
          this.perchases=res.data
          const index=this.perchases.findIndex((c:any)=>c.uuid == this.purchaseUuid)
          if(index>-1){
            this.purchase=this.perchases[index]
          }
        }
        else{
          this.purchase=res.data
        }
      },complete:()=>{
        setTimeout(()=>{
          if(type=='viewOnly'){
          this.download()}
        },400)
      }
    }))
  }

   download() {
    if (this.purchase?.image) {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onload = () => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr.response);

            // Determine the file type and set the appropriate file extension
            const contentType = xhr.getResponseHeader('Content-Type');
            let fileExtension = 'png'; // Default extension
            if (contentType) {
                if (contentType === 'application/pdf') {
                    fileExtension = 'pdf';
                } else if (contentType.includes('image')) {
                    fileExtension = contentType.split('/')[1]; // e.g., 'image/jpeg' => 'jpeg'
                }
            }

            a.download = `downloaded_file.${fileExtension}`; // Set the file name and extension
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        xhr.open('GET', this.purchase?.image);
        xhr.send();
    }
    else {
      if(this.viewOnly){
        if(this.language == 'ar'){
          this.toastr.error('لا يوجد وسائط لهذا الشراء');
        }else{
          this.toastr.error('No Media For This purchase');
        }
      }
        
    }
}



   @ViewChild('shareModel') shareModel!: ElementRef<HTMLElement>;
@ViewChild('textInput') textInput!: ElementRef;
openModal(event:any) {
  let frontBaseURL = environment.frontBaseUrl;
  this.textInput.nativeElement.value=`${frontBaseURL}/user/purchases/purchases-details/viewOnly/${this.type}/${this.purchaseUuid}`
  let el: HTMLElement = this.shareModel.nativeElement;
    el.click();
}
copyLink(event:any){
    // this.textInput.nativeElement.value=`'http://fatoraprofront.restart-technology.com/'${this.router.url}`
    const text = this.textInput.nativeElement.value;
    this.textInput.nativeElement.select();
    this.copier.copyText(text);
    if(this.language == 'ar'){
      this.toastr.info('تم نسخ الرابط بنجاح')
    }else{
      this.toastr.info('Link copied successfully')
    }
}

@ViewChild('sendToClientModel') sendToClientModel!: ElementRef<HTMLElement>;
openSendToClientModel(event:any) {
  let el: HTMLElement = this.sendToClientModel.nativeElement;
    el.click();
}


sendToclient(){
  if(this.sendToClientForm.valid && this.sendToClientForm.dirty){
    this.subs.add(this.http.postReq(`api/dashboard/invoices/${this.purchaseUuid}/send`,this.sendToClientForm.value).subscribe({
      next:res=>{

      },complete:()=>{
        let el: HTMLElement = this.shareModel.nativeElement;
        el.click();
      }
    }))

  }
  else{
    this.sendToClientForm.markAllAsTouched()
  }
}

AddPayment(){
  let uuid = this.purchase.uuid
  this.paymentForm.controls['purchasing_uuid'].setValue(uuid);
  let currentName = this.paymentForm.get('name.ar')?.value;
  this.paymentForm.get('name')?.setValue({
    ar: currentName,
    en:currentName
  });

  if(this.purchase.currency_is_sar == 1 ){
    this.paymentForm.controls['paid_amount'].setValue(Number(this.paymentForm.controls['converted_amount'].value))
  }

  this.paymentForm.controls['converted_amount'].setValue(Number(this.paymentForm.controls['converted_amount'].value))
  let newPaid =   this.paymentForm.controls['converted_amount'].value;
  
  if(this.purchase.unpaid_converted && this.paymentForm.valid && newPaid <= this.purchase.unpaid_converted){

    this.subs.add(this.http.postReq(`api/dashboard/purchasings/${uuid}/purchase_payments`,  this.paymentForm.value).subscribe({
      next:res=>{
        let paid_amount = res?.data?.paid_amount;
        let converted_amount = res?.data?.converted_amount;

        if(paid_amount && this.purchase.unpaid_converted && this.purchase.remaining_amount){
          this.purchase.unpaid_converted -= Number(converted_amount);
          this.purchase.remaining_amount -= Number(paid_amount);

          this.purchase.unpaid_converted = Number(this.purchase.unpaid_converted.toFixed(2)) 
          this.purchase.remaining_amount = Number(this.purchase.remaining_amount.toFixed(2))
        }

        this.addedPayments.push(res.data);
        
      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('Payment added successfully');
        }else{
          this.toastr.info(' تم اضافة دفعة بنجاح.');
        }

        this.paymentForm.reset();
      }
    }))
  }else{
    this.paymentForm.markAllAsTouched();
    if(this.language=='en'){
      this.toastr.error('The amount must be less than or equal to the remaining amount');
    }else{
      this.toastr.error('يجب ان يكون المبلغ اكبر من الصفر اصغر من او يساوى المبلغ المتبقى');
    }
    this.paymentForm.reset();
  }
 
}

updateTotalAmount(){
  let amount = 0;
  let ConvAmount = Number(this.paymentForm.controls['converted_amount'].value);
  if(this.purchase.conversion_rate && this.purchase.conversion_rate >= 0 && ConvAmount > 0){
     amount = ConvAmount * this.purchase.conversion_rate;
     amount = Number(amount.toFixed(2));
     amount = amount >= 0 ? amount : 0;
     this.paymentForm.controls['paid_amount'].setValue(amount,{ emitEvent: false })
  }else{
    // this.paymentForm.controls['converted_amount'].setValue(null)
    this.paymentForm.controls['paid_amount'].setValue(null)
  }
}

}
