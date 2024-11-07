import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userInvoice } from '@models/user-invoices';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';

import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CopyContentService } from '@services/copy-content';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { InvoicesService } from '@services/invoices.service';
import { InvoiceTemplateComponent } from '@modules/invoice-template/invoice-template.component';
import { AuthService } from '@services/auth.service';
import { Response } from '@modules/response';
import { ColumnValue, ControlItem, columnHeaders } from '@modules/tableData';
import { receipt } from '@modules/receipt';
import { creditNotes } from '@modules/credit-notes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Download_pdfService } from '@services/download_pdf.service';


var Buffer = require('buffer/').Buffer;

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

  baseURL = environment.baseUrl;

  
  items=[{label:'تفاصيل الفاتورة',id:'1',command: (event:any) => {
    this.activeItem=this.items[0]
  }}
  ,{label:'سندات القبض',id:'2',command: (event:any) => {
    this.activeItem=this.items[1]
  }},
  {label:'الاشعارات الدائنة',id:'3',command: (event:any) => {
    this.activeItem=this.items[2]
  }},
  // {label:'الاشعارات المدينة',id:'4',command: (event:any) => {
  //   this.activeItem=this.items[3]
  // }}
]
  invoiceColor:string=''
  default_template_id:number=0
  logo:string=''
  sendToClientForm!:FormGroup
  sendViaWhatsappForm!:FormGroup
  selectedValues1!:boolean
  selectedValues2!:boolean
  showcolumn!:boolean
  uuid:string=''
  invoice:userInvoice = {} as userInvoice;
  formDataPayLoad = new FormData();
  companyLogo: any = ''
  private subs=new Subscription()
  activeItem!: MenuItem;
  totalTax:number=0
  totalWithoutTax:number=0
  remainingAmount!:number
  @ViewChild('toDownload') htmlPage!: ElementRef;
viewType:boolean = false;

   myAngularxQrCode: string = '';

   InvoiceActive :boolean = true;
   showWarning :boolean = false;
   showErrors :boolean = false;
   

  //  ---- سند القبض ---------
  columnsArray:columnHeaders[]= [
    {
      nameAR:'رقم السند',
     nameEN:'Receipt id'
    },
    {
     nameAR: 'رقم الفاتورة',
     nameEN:'Invoice id',
    },
    {
     nameAR: 'المبلغ',
nameEN:'Amount'
    },
    {
     nameAR: 'تحميل',
     nameEN:'download'

    },
    {
     nameAR: 'تاريخ الإستلام',
     nameEN:'Received at'
    },{
     nameAR: 'طريقة الدفع',
nameEN:'Payment method'
    }

  ]
   columnsNames:ColumnValue[]= [
    {
      name:'number',
      type:'normal'
    },
    {
      name:'invoice_number',
      type:'normal'
    },
    {
      name:'amount',
      type:'normal'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'received_at',
      type:'normal'
    },
    {
      name:'payment_method',
      type:'normal'
    }
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'رؤية  سند القبض',
      nameEN:'View Receipt',
      route:{
        path:'/user/invoices/receipt-voucher-details/',
        attribute:'uuid'
      },
      popUp:''
    },

   ]

   ReceiptVoucher:receipt[]=[]

   discountTypes=[
    {
      id:1,
      name_ar:'نسبة مئوية',
      name_en:'Percentage',
    },
    {
      id:2,
      name_ar:' قيمة ',
      name_en:'Value',
    },
]

  //  ----اشعار دائن
  CreditcolumnsArray:columnHeaders[]= [
    {
      nameAR:'رقم الاشعار الدائن',
      nameEN:'Credit note id'
    },
    {
      nameAR:  'العميل',
      nameEN:'Client'
    },
    {
      nameAR: 'تحميل',
      nameEN:'Download'
    },
    {
      nameAR: 'الاجمالي',
      nameEN:'Amount'
    },
    {
      nameAR:' هيئة الزكاة ',
      nameEN:'Zatca Status'
    }
   ]

   CreditcolumnsNames:ColumnValue[]= [
    {
      name:'number',
      type:'normal'
    },
    {
      name:'client',
      type:'blueClientId'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'total',
      type:'normal'
    },
    {
      name:'zatca_send_status',
      type:'zatca_status'
    }
   ]
  
   CreditcontrolArray:ControlItem[]=[
    {
      nameAR:'رؤية الاشعار الدائن ',
      nameEN:'View Credit Notice',
      route:{
        path:'/user/invoices/credit-note-details/details/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:'ارسل إلى هيئة الزكاة',
      nameEN:'Submit to Zatca',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'submitToZatcaCredit'
    }
   ]
   
    //  ----اشعار مدين
  DebitcolumnsArray:columnHeaders[]= [
    {
      nameAR:'رقم الاشعار المدين',
      nameEN:'Debit note id'
    },
    {
      nameAR:  'العميل',
      nameEN:'Client'
    },
    {
      nameAR: 'تحميل',
      nameEN:'Download'
    },
    {
      nameAR: 'الاجمالي',
      nameEN:'Amount'
    },
    {
      nameAR:' هيئة الزكاة ',
      nameEN:'Zatca Status'
    }
   ]

   DebitcolumnsNames:ColumnValue[]= [
    {
      name:'number',
      type:'normal'
    },
    {
      name:'client',
      type:'blueClientId'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'total',
      type:'normal'
    },
    {
      name:'zatca_send_status',
      type:'zatca_status'
    }
   ]
  
   DebitcontrolArray:ControlItem[]=[
    {
      nameAR:'رؤية الاشعار المدين ',
      nameEN:'View Debit Notice',
      route:{
        path:'/user/invoices/credit-note-details/details/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:'ارسل إلى هيئة الزكاة',
      nameEN:'Submit to Zatca',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'submitToZatcaCredit'
    }
   ]

   crediteNotes!:creditNotes[]
   debitNotes!:creditNotes[]
  constructor(private activeRoute:ActivatedRoute,
    private fb:FormBuilder,
     private copier:CopyContentService,
     private http:HttpService,
     private changeLang:ChangeLanguageService,
     public invoiceService:InvoicesService,
     private auth:AuthService,
     private httpClient: HttpClient,
     private download_pdfService:Download_pdfService,
     private router:Router,private toastr:ToastrService) { }
  // private copier:CopyContentService,
 language:any
  ngOnInit() {
    
    this.language=this.changeLang.local_lenguage
    
   
    if(this.language=='en' && !this.viewType){
      this.items[0].label='Invoice details'
      this.items[1].label='Receipt Voucher'
      this.items[2].label='Credit Notice'
      // this.items[3].label='Debit Notice'

    }
    else {
      this.items[0].label=='تفاصيل الفاتورة'
      this.items[1].label=='سندات القبض'
      this.items[2].label=='الاشعارات الدائنة'
      // this.items[3].label=='الاشعارات المدينة'
    }

    if(localStorage.getItem('invoiceColor')){
      this.invoiceColor=String(localStorage.getItem('invoiceColor'))
    }
    else{
      this.invoiceColor='#6610f2'
    }
    this.default_template_id=Number(localStorage.getItem('default_template_id'))
    this.logo=String(localStorage.getItem('logo'))
      this.uuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
      // this.viewType= String(this.activeRoute.snapshot.paramMap.get('type'))
      let currentUrl  = this.activeRoute.snapshot.url.join('/')
      this.viewType = currentUrl.includes('viewOnly');

      this.getInvoiceDetails(this.uuid)
      this.activeItem=this.items[0]
      this.sendToClientForm=this.fb.group({
        email:['',Validators.required],
        pdf:['']
      })
      this.sendViaWhatsappForm=this.fb.group({
        phone:['',Validators.required],
        pdf:['']
      })
      if(!this.viewType){
        this.getProfileData()
      }
      else{
        if(this.viewType){
          let dom: any = document.querySelector('body');
          dom.classList.remove('ltr');
          dom.classList.add('rtl');
        }
        setTimeout(()=>{
          this.downloadPdf()
        },400)
        this.auth.setViewOnly(true)
      }
  }
  checkActive(index:number){
if(index===1 && this.selectedValues2){
this.selectedValues2=false
}
if(index===2 && this.selectedValues1){
this.selectedValues1=false
}
  }
  disableEmail=false
  disablePhone=false
getInvoiceDetails(uuid:string){
  let params={
    "uuid":String(uuid)
  }
  let url=''
  if(!this.viewType){
   url=`api/dashboard/invoices/${String(uuid)}`
  }
  else{
    //api without auth
    url=`api/invoice/${String(uuid)}/preview`
  }
this.subs.add(this.http.getReq(url).subscribe({
  next:(res:Response<userInvoice>)=>{
this.invoice=res.data
// this.remainingAmount=this.invoice.total-this.invoice.paid
this.remainingAmount=this.invoice.unpaid
if(this.invoice.client_email){
  this.sendToClientForm.controls['email'].setValue(this.invoice.client_email)
  this.disableEmail=true
  }
if(this.invoice.client_phone){
  this.sendViaWhatsappForm.controls['phone'].setValue(this.invoice.client_phone)
  this.disablePhone=true
  }


  this.InvoiceActive = (res.data.status =='Invoice Cancelled' || res.data.status =='فاتورة ملغية') ? false : true;

  this.ReceiptVoucher = res.data.receipts;
  this.ReceiptVoucher.map(item => item.invoice_number = res.data.number )
  // to get crediteNotes
  this.crediteNotes = res.data.credit_notes;

  // to get debit notes
  // this.debitNotes = res.data.debit_notes;

  this.myAngularxQrCode =  res.data.qr_code


  },complete:async ()=>{
    this.getTotalValues()
 
    //  await this.generateQrCode()
  }
}))
  }
  getTotalValues(){
    this.invoice.products.forEach(element => {
      if(element.tax){
        this.totalTax=this.totalTax+((element.tax/100)*((Number(element.price)*Number(element.quantity))-Number(element.discount)))
      }
      if(element.price && element.discount && element.quantity){
        this.totalWithoutTax= this.totalWithoutTax+(element.price*element.quantity)-element.discount
      }
      else if(element.price && element.quantity){
        this.totalWithoutTax= this.totalWithoutTax+(element.price*element.quantity)
      }
    });

    if(this.invoice?.total_discounts >0){
      this.totalWithoutTax -= this.invoice?.total_discounts;
    }

  }
navigateAddVoucher(){
  this.router.navigate(['invoice/add-voucher',this.uuid])
}

  validateImage(event:any) {
    this.formDataPayLoad.delete('image')
    let reader = new FileReader();
    const file:File = event.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
        // When file uploads set it to file formcontrol
        reader.onload = () => {
          this.companyLogo = reader.result;
        }
        this.formDataPayLoad.append("logo", file);
        this.subs.add(this.http.postReq('api/dashboard/settings/upload',this.formDataPayLoad).subscribe({
          next:res=>{
           console.log(res)
          }
       }))
    }
  }
//  addCompanyLogo(){
//   this.subs.add(this.http.postReq('api/dashboard/settings/upload',this.formDataPayLoad).subscribe({
//     next:res=>{
//      console.log(res)
//     }
//  }))
//  }
@ViewChild('shareModel') shareModel!: ElementRef<HTMLElement>;
@ViewChild('textInput') textInput!: ElementRef;
openModal(event:any) {
  let frontBaseURL = environment.frontBaseUrl;
  this.textInput.nativeElement.value=`${frontBaseURL}/user/invoices/invoice-details/viewOnly/`+this.uuid
//  this.textInput.nativeElement.value='http://localhost:4200/user/invoices/invoice-details/viewOnly/'+this.uuid
  let el: HTMLElement = this.shareModel.nativeElement;
    el.click();
}
copyLink(event:any){
    // this.textInput.nativeElement.value=`'http://fatoraprofront.restart-technology.com/'${this.router.url}`
    const text = this.textInput.nativeElement.value;
    this.textInput.nativeElement.select();
    this.copier.copyText(text);
    if(this.language=='ar'){
      this.toastr.info('.تم نسخ الرابط بنجاح')
    }
    else{
      this.toastr.info('The link has been successfully copied.')
    }
}

@ViewChild('sendToClientModel') sendToClientModel!: ElementRef<HTMLElement>;
openSendToClientModel(event:any) {
  let el: HTMLElement = this.sendToClientModel.nativeElement;
    el.click();
}


@ViewChild('sendViaWhatsappModel') sendViaWhatsappModel!: ElementRef<HTMLElement>;
opensendViaWhatsappModel(event:any) {
  let el: HTMLElement = this.sendViaWhatsappModel.nativeElement;
    el.click();
}

sendToClientData = new FormData();

pdfLoader=false
@ViewChild('InvoiceTemplate') InvoiceTemplate !: InvoiceTemplateComponent;
sendToclient(){
  if (this.sendToClientForm.valid) {
    this.pdfLoader=true
    this.sendToClientData.append('email', this.sendToClientForm.controls['email'].value);
     
    this.subs.add(this.http.postReq(`api/dashboard/invoices/${this.uuid}/send`, this.sendToClientData).subscribe({
      next: res => {

      },
      complete: () => {
        this.pdfLoader=false
        let el: HTMLElement = this.sendToClientModel.nativeElement;
        el.click();
        if(this.language=='en'){
          this.toastr.info('Shared Successfully')
        }
        else{
          this.toastr.info('تمت المشاركة بنجاح')
        }
      },error:()=>{
        this.pdfLoader=false
      }
    }));

    // this.InvoiceTemplate.getPdf().then((doc) => {
     
    //   this.sendToClientData.append('pdf', doc);

    //   this.subs.add(this.http.postReq(`api/dashboard/invoices/${this.uuid}/send`, this.sendToClientData).subscribe({
    //     next: res => {

    //     },
    //     complete: () => {
    //       this.pdfLoader=false
    //       let el: HTMLElement = this.sendToClientModel.nativeElement;
    //       el.click();
    //       if(this.language=='en'){
    //         this.toastr.info('Shared Successfully')
    //       }
    //       else{
    //         this.toastr.info('تمت المشاركة بنجاح')
    //       }
    //     },error:()=>{
    //       this.pdfLoader=false
    //     }
    //   }));
    // });

  } else {
    this.sendToClientForm.markAllAsTouched();
  }
}

sendViaWhatsapp(){
  if (this.sendToClientForm.valid) {
    this.pdfLoader=true
    this.sendToClientData.append('phone', this.sendViaWhatsappForm.controls['phone'].value);
     
    this.subs.add(this.http.postReq(`api/dashboard/invoices/${this.uuid}/send`, this.sendToClientData).subscribe({
      next: res => {

      },
      complete: () => {
        this.pdfLoader=false
        let el: HTMLElement = this.sendViaWhatsappModel.nativeElement;
        el.click();
        if(this.language=='en'){
          this.toastr.info('Sent Successfully')
        }
        else{
          this.toastr.info('تم الإرسال بنجاح')
        }
      },error:()=>{
        this.pdfLoader=false
      }
    }));


  } else {
    this.sendToClientForm.markAllAsTouched();
  }
}

currentCompanyLogo=''
getProfileData(){
  this.subs.add(this.http.getReq('api/dashboard/account/profile').subscribe({
    next:res=>{
     this.currentCompanyLogo=res.data.media.logo
    }
  }))
}




downloadPDF() {
  const content = this.htmlPage.nativeElement;
  const doc = new jsPDF('p', 'mm', 'a4');

  html2canvas(content, {
    scale: 2
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 110;
    const pageHeight = 695;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    let width = doc.internal.pageSize.getWidth();
    let height = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'PNG', 0, position, width, height);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save('Invoice.pdf');
  });
}
downloadBoo=false
downloadBooSimple=false

@ViewChild('downloadBtn') downloadBtn!: ElementRef<HTMLElement>;
downloadPdfBtn() {
  this.invoiceService.downloadShow = true;
    let el: HTMLElement = this.downloadBtn.nativeElement;
    el.click();
}

download(url: string): Observable<Blob> {
  return this.httpClient.get(url, {
    responseType: 'blob',
    headers: new HttpHeaders({
      'Accept': 'application/pdf'
    })
  });
}

downloadPdf(){
  this.download_pdfService.downloadInvoice(this.invoice.uuid)
  //  this.downloadBoo = true ;
  //  setTimeout(() => {
  //   this.downloadPdfBtn()
  //  }, 300);
  }
@ViewChild('downloadsimpleBtn') downloadsimpleBtn!: ElementRef<HTMLElement>;
downloadSimplePdfBtn() {
  this.invoiceService.downloadShow = true;
    let el: HTMLElement = this.downloadsimpleBtn.nativeElement;
    el.click();
}
downloadSimplePdf(){
  this.download_pdfService.downloadSimplifiedInvoice(this.invoice.uuid)

  //  this.downloadBooSimple = true ;
  //  setTimeout(() => {
  //   this.downloadSimplePdfBtn()
  //  }, 300);
  }



generateHexRepresentation(tag:number , value:any): string {
  let valueString = String(value)
  const hexTag = this.toHex(tag);
  const hexLength = this.toHex(valueString.length);

  return hexTag + hexLength + value;
}

 toHex(value: any): string {
  return String.fromCharCode(value);
}


QRCodeTagText = ''
QRCodeReady = false;
  async generateQrCode(){


  let QrCodeTags = [
    {
      tag:1,
      value:this.invoice?.account_name
    },
    {
      tag:2,
      value:this.invoice?.tax_number
    },
    {
      tag:3,
      value:this.invoice?.created_at
    },
    {
      tag:4,
      value:Number(this.invoice?.total)
    },
    {
      tag:5,
      value:this.invoice?.products?.reduce((sum, product) => sum + product.tax, 0)
    }
  ]

  // const base64EncodedTags: string = window.btoa(
  //   QrCodeTags.map(tag => this.generateHexRepresentation(tag.tag,tag.value)).join('')
  // );

   this.QRCodeTagText =  QrCodeTags.map(tag => this.generateHexRepresentation(tag.tag,tag.value)).join('')

  console.log(this.QRCodeTagText);
  
    // let QRCodeTagText =  QrCodeTags.map(tag => `${tag.tag}:${tag.value}`).join(';')
  // console.log(QRCodeTagText);
  
  // const myBuffer = Buffer.from(QRCodeTagText);
  // const base64EncodedTags: string = myBuffer.toString('base64') 

  let base64EncodedTags = '';


  await this.textToBase64(this.QRCodeTagText).then(base64 => {
    base64EncodedTags = base64;
    this.QRCodeReady = true;

  }).catch(error => {
    console.error('Error:', error);
  });
  // console.log('res: ' , base64EncodedTags);
  
  this.QRCodeReady = true;
  // base64EncodedTags = 'AUXZhdik2LPYs9ipINmI2LPYp9mFINin2YTZhtio2Lkg2KfZhNmG2YLZiiDYp9mE2LDZh9io2YrZhyDZhNmE2YXZitin2YcCDzMxMDkwMDQ3MTUwMDAwMwMTMjAyMi0wMi0yMCAxNDoxOTozNwQFODAuMDEFBTEwLjQ0'
  return base64EncodedTags;
}



async textToBase64(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([text], { type: 'text/plain; charset=utf-8' });
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data.split(',')[1]);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
}

print(areaID: any) {
  var printContent: any = document.getElementById(areaID)?.innerHTML;
  var originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
  // When user click cancel route for pervious page

  if (document.hasFocus()) {
    // console.log('Print dialog box was closed without printing');
    window.location.reload();
  }
}
invoices:userInvoice[]=[]
cancelledInvoice(){
  this.invoices.push(this.invoice)
  this.invoices.forEach((element,index)=>{
    this.formDataPayLoad.append(`uuid[${index+1}]`,element.uuid)
  })

this.subs.add(this.http.postReq('api/dashboard/invoices/cancel',this.formDataPayLoad).subscribe({
  next:res=>{

  },complete:()=>{
    this.router.navigate(['/user/invoices/All-invoices'])
    if(this.language=='en'){
      this.toastr.info('Invoices Cancelled successfully')
    }
    else{
      this.toastr.info('تم إلغاء الفواتير بنجاح')
    }
  }
}))
}

@ViewChild('openDeleteModal') openDeleteModal!: ElementRef<HTMLElement>;
openDeleteModel(){
  let el: HTMLElement = this.openDeleteModal.nativeElement;
  el.click();
}

deleteInvoice(){
// delete invoice 
this.subs.add(this.http.postReq(`api/dashboard/invoices/retrieve-inovice/${this.uuid}`).subscribe({
  next:res=>{

  },complete:()=>{
    this.router.navigate(['/user/invoices/All-invoices'])
    if(this.language=='en'){
      this.toastr.info('The invoice has been successfully cancelled.')
    }
    else{
      this.toastr.info('تم إلغاء الفاتورة بنجاح.')
    }
  }
}))
}

// @ViewChild('getLink') getLink!: ElementRef<HTMLElement>;
// getpdfLink() {
//     let el: HTMLElement = this.getLink.nativeElement;
//     el.click();
// }

// getPDFLink(){
//   this.downloadBoo = true ;
//   setTimeout(() => {
//    this.getpdfLink()
//   }, 300);
//  }


submitToZatca(){
   
  this.subs.add(this.http.postReq(`api/dashboard/invoices/send-to-ztaca/${this.uuid}`).subscribe({
    next:res=>{
      if(res.status){
        this.invoice.zatca_stage = res?.zatca_stage;
        this.invoice.zatca_send_status = 1;
        if(this.language=='en'){
         
          this.toastr.success('Sent Successfully')
        }
        else{
          this.toastr.success('تم الارسال بنجاح')
        }
        if(res?.qr_code){
          this.myAngularxQrCode = res?.qr_code
        }
      }else{
        if(this.language=='en'){
          this.toastr.error('Failed to Send')
        }
        else{
          this.toastr.error('فشل فى الارسال ')
        }
        
      }

      if(res.zatca_errors){
        this.invoice.zatca_errors = res?.zatca_errors;
      }
      if(res.zatca_warnings){
        this.invoice.zatca_warnings = res?.zatca_warnings;
      }
      
      if((res.zatca_errors?.length ?? 0)> 0){
      
        this.invoice.zatca_errors = res?.zatca_errors;
        this.invoice.eligible_sending_zatca = true;
        this.invoice.zatca_send_status = 0;
      }
      else if( (res.zatca_warnings?.length ?? 0)> 0){

        this.invoice.zatca_warnings = res?.zatca_warnings;
        this.invoice.eligible_sending_zatca = true;
        this.invoice.zatca_send_status = 1;
      }

      if(this.crediteNotes && this.crediteNotes.length > 0){
        this.crediteNotes.map(item => item.zatca_check_parent_invoice = true);
      }
     
    },error:(err)=>{
      
      if(err?.redirect_to_edit){
        this.toastr.clear();
        if(this.language=='en'){
          this.toastr.error('Please Complete Client  data')
        }
        else{
          this.toastr.error('يرجى إكمال بيانات العميل')
        }
        this.router.navigate(['/user/users/edit-user',err?.client_id])
      }
      else if((err.zatca_errors?.length ?? 0)> 0){
      
        this.invoice.zatca_errors = err?.zatca_errors;
        this.invoice.eligible_sending_zatca = true;
        this.invoice.zatca_send_status = 0;
      }
      else if( (err.zatca_warnings?.length ?? 0)> 0){

        this.invoice.zatca_warnings = err?.zatca_warnings;
        this.invoice.eligible_sending_zatca = true;
        this.invoice.zatca_send_status = 1;
      }

      if(err?.zatca_stag){
        this.invoice.zatca_stage = err?.zatca_stage;
      }
      if(err.zatca_errors){
        this.invoice.zatca_errors = err?.zatca_errors;
      }
      if(err.zatca_warnings){
        this.invoice.zatca_warnings = err?.zatca_warnings;
      }
    }
  }))
}

}
