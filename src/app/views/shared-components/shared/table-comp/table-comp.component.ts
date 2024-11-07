import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { Download_pdfService } from '@services/download_pdf.service';
import { HttpService } from '@services/http.service';
import { InvoicesService } from '@services/invoices.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

interface ColumnValue{
  name:string,
  type:string,
  optionalType?:string
}
interface ControlItem{
  nameAR:String,
  nameEN:string
  route:{
    path:string,
    attribute:string
  },
  popUp:string
}
interface columnHeaders{ 
  nameAR:String,
  nameEN:string
}


@Component({
  selector: 'app-table-comp',
  templateUrl: './table-comp.component.html',
  styleUrls: ['./table-comp.component.scss']
})
export class TableCompComponent implements OnInit,OnChanges {

  products = [
    {
    code:'ddd',
    name:'sadsad',
    category:'sds',
    quantity:'sdd'
  },
  {
    code:'ddd',
    name:'sadsad',
    category:'sds',
    quantity:'sdd'
  },
  {
    code:'ddd',
    name:'sadsad',
    category:'sds',
    quantity:'sdd'
  },
]

  private subs = new Subscription();

  @Input() columnsArray:columnHeaders[]= []
 @Input() type:string=''
  @Input() columnsNames:ColumnValue[]= []
  @Input() RowsData:any = [];
  selectedInvoices:string[]=[]
  @Input() controlArray:ControlItem[] = [];
  @Input() resetCheckbox:boolean = false;
  @Output() setCheckboxFalse = new EventEmitter<any>();
  downloadedData:any
  invoiceColor:any
  default_template_id:any
  language:any

  downloadReady:boolean = false;


  paymentForm!:FormGroup;
  Purchase_remaining_amount = 0;
  unpaid_converted_amount = 0;
  currency:any = [];
  conversion_rate:number = 1;
  paymentCurrency:string = '';
  rate_is_changed:boolean = false;
  constructor(private http:HttpService,public authSer:AuthService,
    public router:Router,private toastr:ToastrService,private fb:FormBuilder,
    private validationserv:ValidationService,
    private sanitizer: DomSanitizer,
    public invoiceService:InvoicesService,private changeLangService:ChangeLanguageService,
    private download_pdfService:Download_pdfService) { }

  ngOnInit() {
    this.getCurrencySAR();
    this.paymentForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.compose([ Validators.required])],
        en: ['',Validators.compose([ Validators.required])] 
      }),
      paid_amount:['',Validators.required],
      converted_amount:['',Validators.required],
      // currency:['',Validators.required],
      // conversion_rate:['',Validators.required],
      purchasing_uuid:['',Validators.required]
    })
    
    this.language=this.changeLangService.local_lenguage
    // console.log(this.language)
    this.invoiceColor=String(localStorage.getItem('invoiceColor'))
    this.default_template_id=(Number(localStorage.getItem('default_template_id')) > 0) ? Number(localStorage.getItem('default_template_id')) : 1
  }

  getCurrencySAR() {
    this.http.getReq('api/sar-currency-rates').subscribe({
      next: (res) => {
        this.currency = res.data;
      },
    });
  }
  updateTotalAmount(){
    let amount = 0;
    let ConvAmount = Number(this.paymentForm.controls['converted_amount'].value);
    if(this.conversion_rate >= 0 && ConvAmount > 0){
       amount = ConvAmount * this.conversion_rate;
       amount = Number(amount.toFixed(2));
       amount = amount >= 0 ? amount : 0;
       this.paymentForm.controls['paid_amount'].setValue(amount,{ emitEvent: false })
    }else{
      // this.paymentForm.controls['converted_amount'].setValue(null)
      this.paymentForm.controls['paid_amount'].setValue(null)
    }
  }
  // chooseCurrency(currentCurrencyVal:any){
  //   let currentCurrencyindex = this.currency.findIndex((currency:any) => currency.currency_code == currentCurrencyVal)
  //   if(currentCurrencyindex > -1){
  //      this.conversion_rate = this.currency[currentCurrencyindex].rate
  //      this.conversion_rate = Number((1 / this.conversion_rate).toFixed(2));
  //      this.conversion_rate = Number(this.conversion_rate.toFixed(2));
  //   }
  //   this.paymentForm.controls['conversion_rate'].setValue(this.conversion_rate,{ emitEvent: false })
  // }
  // updateExchangeAmount(){
  //   this.conversion_rate = Number(this.paymentForm.controls['conversion_rate'].value)
  //   this.updateTotalAmount();
  // }
  // changeExchangeRate(e:any){
  //   this.rate_is_changed = !this.rate_is_changed;
  //   if(!this.rate_is_changed){
  //     let currentCurrencyVal = this.paymentForm.controls['currency'].value
  //     let currentCurrencyindex = this.currency.findIndex((currency:any) => currency.currency_code == currentCurrencyVal)
  //     if(currentCurrencyindex > -1){
  //        this.conversion_rate = this.currency[currentCurrencyindex].rate
  //        this.conversion_rate = Number((1 / this.conversion_rate).toFixed(2));
  //        this.conversion_rate = Number(this.conversion_rate.toFixed(2));
  //     }
  //     this.paymentForm.controls['conversion_rate'].setValue(this.conversion_rate,{ emitEvent: false })
  //   }
  // }

  @HostListener('document:hidden.bs.modal', ['$event'])
  onModalDismiss(event: Event): void {
    const modalId = (event.target as HTMLElement).id;
    if (modalId === 'addNewModal') {
      this.paymentForm.reset();
    }
  }

  fillPaymentFormData(dataItem:any){
    this.purchase_uuId = dataItem['uuid'];
    this.purchase_currency_is_sar = Number(dataItem['currency_is_sar']);
    this.Purchase_remaining_amount = Number(dataItem['remaining_amount'].toFixed(2));
    this.unpaid_converted_amount = Number(dataItem['unpaid_converted'].toFixed(2));
    this.conversion_rate = Number(dataItem['conversion_rate']);
    this.paymentCurrency = dataItem['currency'];
  }
  AddPayment(){
    let uuid = this.purchase_uuId
    this.paymentForm.controls['purchasing_uuid'].setValue(uuid);
    let index = this.RowsData.findIndex((i: { uuid: string; }) => i.uuid == uuid)
    let currentName = this.paymentForm.get('name.ar')?.value;
    this.paymentForm.get('name')?.setValue({
      ar: currentName,
      en:currentName
    });

    if(this.purchase_currency_is_sar == 1 ){
      this.paymentForm.controls['paid_amount'].setValue(Number(this.paymentForm.controls['converted_amount'].value))
    }

    this.paymentForm.controls['converted_amount'].setValue(Number(this.paymentForm.controls['converted_amount'].value))
    let newPaid =   this.paymentForm.controls['converted_amount'].value;
    
    if(this.paymentForm.valid && newPaid <= this.unpaid_converted_amount){

      this.subs.add(this.http.postReq(`api/dashboard/purchasings/${uuid}/purchase_payments`,  this.paymentForm.value).subscribe({
        next:res=>{

          let paid_amount = res?.data?.paid_amount;
          let converted_amount = res?.data?.converted_amount;

          if(paid_amount && paid_amount && converted_amount){
           this.RowsData[index].unpaid_converted -= Number(converted_amount);
           this.RowsData[index].remaining_amount -= Number(paid_amount);

           this.RowsData[index].unpaid_converted = Number(this.RowsData[index].unpaid_converted.toFixed(2)) 
           this.RowsData[index].remaining_amount = Number(this.RowsData[index].remaining_amount.toFixed(2))
          }

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
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['resetCheckbox']){
      if(this.resetCheckbox){
        this.setCancelledInvoice([])
        // this.resetCheckbox=false
        this.setCheckboxFalse.emit(false)
        this.selectedInvoices=[]
      }
    }
  }

  restoreUser(uuid:string){
    this.subs.add(this.http.putReq(`api/dashboard/clients/${uuid}/restore`).subscribe({
      next:res=>{
  
      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('Client restored successfully')
        }else{
          this.toastr.info(' تم استعادته العميل بنجاح.')
        }
        const index=this.RowsData.findIndex((c: { uuid: string; }) => c.uuid == uuid)
        if (index > -1) {
          this.RowsData.splice(index, 1)
        }
      }
    }))
  }

  restoreInvoice(uuid:string){
    this.subs.add(this.http.putReq(`api/admin/invoices/restore/${uuid}`).subscribe({
      next:res=>{
  
      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('Invoice restored successfully')
        }else{
          this.toastr.info(' تم استعادته الفاتورة بنجاح.')
        }
        const index=this.RowsData.findIndex((c: { uuid: string; }) => c.uuid == uuid)
        if (index > -1) {
          this.RowsData.splice(index, 1)
        }
      }
    }))
  }

  setCancelledInvoice(event:any){
      this.invoiceService.setCancelledInvoices(event)
  }

  // invoiceService.downloadShow=false
@ViewChild('downloadBtn') downloadBtn!: ElementRef<HTMLElement>;
downloadPdfBtn() {
    let el: HTMLElement = this.downloadBtn.nativeElement;
    el.click();
}
InvoiceType:any
downloadPaymentPdf(uuid:string,id?:any){
  this.download_pdfService.downloadAdminPayment(uuid,id)
}
downloadPdf(uuid:string,id?:any){
  
 
  // window.scrollTo(0, 0);
  // console.log(this.type);
  
   if(this.type=='taxReports'){
    this.download_pdfService.downloadTaxReports(uuid)
   }
   if(this.type=='quotation'){
    // this.InvoiceType=1
    this.download_pdfService.downloadQuotations(uuid)
    // this.getQuotations(uuid)
   }
   else if (this.type=='credit'){
    //  this.InvoiceType=1
    // this.getCreditNotesDetails(uuid)

    this.download_pdfService.downloadCreditNotes(uuid)

   }
   else if(this.type=='creditAdmin'){
    //  this.InvoiceType=1
    // this.getAdminCreditNotesDetails(uuid)

    this.download_pdfService.downloadCreditNotes(uuid)
   }
   else if(this.type=='voucher'){
    //  this.InvoiceType=1
    // this.getReceipt(uuid)
    this.download_pdfService.downloadReceipts(uuid)
   }
   else if(this.type=='Purchase'){
     this.InvoiceType=1
    this.download(uuid)

   }
   else if(this.type=='ClientInvoice'){
    //  this.InvoiceType=Number(localStorage.getItem('default_template_id'))
    // this.getInvoice(uuid)
    this.download_pdfService.downloadInvoice(uuid)
   }
   else if(this.type=='AdminInvoice'){
    // this.type='ClientInvoice'
    // this.InvoiceType=Number(localStorage.getItem('default_template_id'))

    // this.getAdminInvoice(uuid)

    this.download_pdfService.downloadInvoice(uuid)
   }

   else if(this.type=='AdminInvoice_deleted'){
    // this.type='ClientInvoice'
    // this.InvoiceType=Number(localStorage.getItem('default_template_id'))

    // this.getAdminInvoice(uuid)

    this.download_pdfService.downloadInvoice_deleted(uuid)
   }
   else if(this.type=='subsInvoice'){
    // this.InvoiceType=Number(localStorage.getItem('default_template_id'))
    // this.getPayment(uuid,id)

    this.download_pdfService.downloadInvoice(uuid)
   }

  }

  getQuotations(uuid:string){
    this.subs.add(this.http.getReq(`api/dashboard/quotations/${uuid}`).subscribe({
     next:res=>{
       this.downloadedData=res.data
     },complete:()=> {
      this.freezeScroll()
      this.invoiceService.downloadShow = true ;
      setTimeout(() => {
       this.downloadPdfBtn()
      }, 300);
     },
    }))
  }

  submitToZatca(uuid:string,index:number){
   
    this.subs.add(this.http.postReq(`api/dashboard/invoices/send-to-ztaca/${uuid}`).subscribe({
      next:res=>{
        if(res.status){
          this.RowsData[index].zatca_send_status = 1;
          if(res?.zatca_stage){
            this.RowsData[index].zatca_stage = res?.zatca_stage;
          }
          
          if(this.language=='en'){
            
            this.toastr.success('Sent Successfully')
          }
          else{
            this.toastr.success('تم الارسال بنجاح')
          }
        }else{
          if(this.language=='en'){
            this.toastr.error('Failed to Send')
          }
          else{
            this.toastr.error('فشل فى الارسال ')
          }
          
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
          // this.router.navigate(['user/settings/commercial-account-details'])
        }
      }
    }))
  }
  submitToZatcaCredit(uuid:string,index:number){
    console.log(this.RowsData[index]);
    
   if(this.RowsData[index].zatca_check_parent_invoice){
    this.subs.add(this.http.postReq(`api/dashboard/credit_notes/send-to-ztaca/${uuid}`).subscribe({
      next:res=>{
        if(res.status){
          this.RowsData[index].zatca_send_status = 1;
          if(res?.zatca_stage){
            this.RowsData[index].zatca_stage = res?.zatca_stage;
          }
          
          if(this.language=='en'){
            
            this.toastr.success('Sent Successfully')
          }
          else{
            this.toastr.success('تم الارسال بنجاح')
          }
        }else{
          if(this.language=='en'){
            this.toastr.error('Failed to Send')
          }
          else{
            this.toastr.error('فشل فى الارسال ')
          }
          
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
          // this.router.navigate(['user/settings/commercial-account-details'])
        }
      }
    }))
   }else{
    if(this.language=='en'){
      this.toastr.error('Please Send Invoice to Zatca first')
    }
    else{
      this.toastr.error('يرجى ارسال الفاتورة الى هيئة الزكاة أولاً ')
    }
   }
    

  }
  freezeScroll() {
    document.body.style.overflow = 'hidden';
  }

  getReceipt(uuid:string){
    let url=''
    if(this.authSer.getUserObj().role=='user'){
     url=`api/dashboard/receipts/${uuid}`
    }
    else{
     url=`api/admin/receipts/${uuid}/preview`
    }
    this.subs.add(this.http.getReq(url).subscribe({
      next:res =>{
        this.downloadedData=res.data
      },complete:()=> {
        this.freezeScroll()
        this.invoiceService.downloadShow = true ;
        setTimeout(() => {
         this.downloadPdfBtn()
        }, 100);
       },
    }))
  }

  getCreditNotesDetails(uuid:string){
    this.subs.add(this.http.getReq(`api/dashboard/credit_notes/${uuid}`).subscribe({
      next:res=>{
        this.downloadedData=res.data
      },complete:()=> {
        this.freezeScroll()
        this.invoiceService.downloadShow = true ;
        setTimeout(() => {
         this.downloadPdfBtn()
        }, 300);
       },
    }))
  }

  getAdminCreditNotesDetails(uuid:string){
    this.subs.add(this.http.getReq(`api/admin/credit_notes/${uuid}`).subscribe({
      next:res=>{
        this.downloadedData=res.data
      },complete:()=> {
        this.freezeScroll()
        this.invoiceService.downloadShow = true ;
        setTimeout(() => {
         this.downloadPdfBtn()
        }, 300);
       },
    }))
  }

  getInvoice(uuid:string){
    this.subs.add(this.http.getReq(`api/dashboard/invoices/${String(uuid)}`).subscribe({
      next:res=>{
        this.downloadedData=res.data
      },complete:()=> {
        this.freezeScroll()
        this.invoiceService.downloadShow = true ;
        setTimeout(() => {
         this.downloadPdfBtn()
        }, 300);
       },
    }))
  }
  getAdminInvoice(uuid:string){
    this.subs.add(this.http.getReq(`api/admin/invoices/${uuid}/preview`).subscribe({
      next:res=>{
        this.downloadedData=res.data
      },complete:()=> {
        this.freezeScroll()
        this.invoiceService.downloadShow = true ;
        setTimeout(() => {
         this.downloadPdfBtn()
        }, 300);
       },
    }))
  }
  getPayment(uuid:string,id:any){
    this.subs.add(this.http.getReq(`api/admin/subscriptions/${uuid}/${id}/invoice`).subscribe({
      next:res=>{
        this.downloadedData=res.data
      },complete:()=> {
        this.freezeScroll()
        this.invoiceService.downloadShow = true ;
        setTimeout(() => {
         this.downloadPdfBtn()
        }, 300);
       },
    }))
  }

  download(uuid:string) {
    const index=this.RowsData.findIndex((c:any)=>c.uuid==uuid)
    this.RowsData[index]?.image
    if (this.RowsData[index]?.image) {
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
        // let img = 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600';
        xhr.open('GET', this.RowsData[index]?.image);
        //  xhr.open('GET', img);
        xhr.send();
    }
    else {
        this.toastr.error('No Media For This Product');
    }
}

  // download(uuid:string){
  //  const index=this.RowsData.findIndex((c:any)=>c.uuid==uuid)
  //  if(index>-1){
  //   if(this.RowsData[index]?.image){
  //     // const link = document.createElement('a');
  //     // link.setAttribute('target', '_blank');
  //     // link.setAttribute('href', this.RowsData[index]?.image);

      
  //     // link.setAttribute('download', `image.png`);
  //     // document.body.appendChild(link);
  //     // link.click();
  //     // link.remove();

  //     const xhr = new XMLHttpRequest();
  //     xhr.responseType = 'blob';
    
  //     xhr.onload = () => {
  //       const a = document.createElement('a');
  //       a.href = window.URL.createObjectURL(xhr.response);
  //       a.download = 'image.png'; // You can set the desired file name here
  //       a.style.display = 'none';
    
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //     };
   
  //     xhr.open('GET', this.RowsData[index]?.image);
  //     // xhr.setRequestHeader('Access-Control-Request-Headers', '*');
  //     // xhr.setRequestHeader('Access-Control-Request-Method', '*');
  //     // xhr.setRequestHeader('Content-Type', 'application/json');
  //     // xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  //     // xhr.setRequestHeader('Access-Control-Allow-Credentials', 'false');

  //     xhr.send();
  //   }
  //   else{
  //     if(this.language=='en'){
  //       this.toastr.error('No Media For This Product')
  //     }
  //     else{
  //       this.toastr.error('لا توجد وسائط لهذا المنتج.')

  //     }
  //   }
  //  }
  // }
  navigateToClient(uuid:string){
    this.router.navigate(['/user/users/user-details/',uuid]).then(()=>{
      window.location.reload()
    })
  }
  deleteProduct(productUuid:any){
    // todo cancel invoice ---
    this.subs.add(this.http.deleteReq(`api/dashboard/products/${productUuid}`).subscribe({
      next:res=>{

      },complete:()=>{
        const index=this.RowsData.findIndex((c:any)=>c.uuid == productUuid)
        if(index>-1){
          this.RowsData.splice(index,1)
        }
        if(this.language=='en'){
          this.toastr.info('Product Deleted Successfully')
        }
        else{
          this.toastr.info('تم حذف المنتج بنجاح.')
        }
        this.closeModal()
      }

    }))
  }

  deleteInvoice(invoiceUuid:any){
 
    this.subs.add(this.http.postReq(`api/dashboard/retrieve-inovice/${invoiceUuid}`).subscribe({
      next:res=>{

      },complete:()=>{
        const index=this.RowsData.findIndex((c:any)=>c.uuid == invoiceUuid)
        if(index>-1){
          this.RowsData.splice(index,1)
        }
        if(this.language=='en'){
          this.toastr.info('The invoice has been successfully cancelled.')
        }
        else{
          this.toastr.info('تم إلغاء الفاتورة بنجاح.')
        }
        this.closeModal()
      }

    }))
  }
  deleteClient(clientUuid:any){
    this.subs.add(this.http.deleteReq(`api/dashboard/clients/${clientUuid}`).subscribe({
      next:res=>{

      },complete:()=>{
        const index=this.RowsData.findIndex((c:any)=>c.uuid == clientUuid)
        if(index>-1){
          this.RowsData.splice(index,1)
        }
        if(this.language=='en'){
          this.toastr.info('Client Deleted Successfully')
        }
        else{
          this.toastr.info('تم حذف العميل بنجاح.')
        }
      }

    }))
  }

  deleteSupplier(SupplierUuid:any){
    this.subs.add(this.http.deleteReq(`api/dashboard/suppliers/${SupplierUuid}`).subscribe({
      next:res=>{

      },complete:()=>{
        const index=this.RowsData.findIndex((c:any)=>c.uuid == SupplierUuid)
        if(index>-1){
          this.RowsData.splice(index,1)
        }
        if(this.language=='en'){
          this.toastr.info('Supplier Deleted Successfully')
        }
        else{
          this.toastr.info('تم حذف المورد بنجاح.')
        }
      }

    }))
  }

  deleteDuration(DurationId:any){
    this.subs.add(this.http.deleteReq(`api/admin/plan/durations/${DurationId}`).subscribe({
      next:res=>{

      },complete:()=>{
        const index=this.RowsData.findIndex((c:any)=>c.plan_duration_id == DurationId)
        if(index>-1){
          this.RowsData.splice(index,1)
        }
        if(this.language=='en'){
          this.toastr.info('Duration Deleted Successfully')
        }
        else{
          this.toastr.info('تم حذف المدة بنجاح.')
        }
      }

    }))
  }
  deleteAdminProduct(userUuid:any){
      this.subs.add(this.http.deleteReq(`api/admin/users/${userUuid}`).subscribe({
        next:res=>{
  
        },complete:()=>{
          const index=this.RowsData.findIndex((c:any)=>c.uuid == userUuid)
          if(index>-1){
            this.RowsData.splice(index,1)
          }
          if(this.language=='en'){
            this.toastr.info('User Deleted Successfully')
          }
          else{
            this.toastr.info('تم حذف المستخدم بنجاح.')
          }
          this.closeModal()
        }
        
      }))
    
  }
  deleteAdminPlan(userUuid:any){
      this.subs.add(this.http.deleteReq(`api/admin/users/${userUuid}`).subscribe({
        next:res=>{
  
        },complete:()=>{
          const index=this.RowsData.findIndex((c:any)=>c.uuid == userUuid)
          if(index>-1){
            this.RowsData.splice(index,1)
          }
          if(this.language=='en'){
            this.toastr.info('Subscription Deleted Successfully')
          }
          else{
            this.toastr.info('تم حذف الإشتراك بنجاح.')
          }
          this.closeModal()

        }
  
      }))
    
  }
  deleteAdminRole(id:any){
      this.subs.add(this.http.deleteReq(`api/admin/roles/${id}`).subscribe({
        next:res=>{
  
        },complete:()=>{
          const index=this.RowsData.findIndex((c:any)=>c.id == id)
          if(index>-1){
            this.RowsData.splice(index,1)
          }
          if(this.language=='en'){
            this.toastr.info('Role Deleted Successfully')
          }
          else{
            this.toastr.info('تم حذف الدور بنجاح.')
          }
          this.closeModal()

        }
  
      }))
    
  }

  deleteAdminCoupon(id:any){
    this.subs.add(this.http.deleteReq(`api/admin/vouchers/${id}`).subscribe({
      next:res=>{

      },complete:()=>{
        const index=this.RowsData.findIndex((c:any)=>c.id == id)
        if(index>-1){
          this.RowsData.splice(index,1)
        }
        if(this.language=='en'){
          this.toastr.info('Coupon Deleted Successfully')
        }
        else{
          this.toastr.info('تم حذف الكوبون بنجاح.')
        }
        this.closeModal()

      }

    }))
  
}
     DeleteAdminPlan(id:any){
    this.subs.add(this.http.deleteReq(`api/admin/plans/${id}`).subscribe({
      next:res=>{

      },complete:()=>{
        const index=this.RowsData.findIndex((c:any)=>c.id == id)
        if(index>-1){
          this.RowsData.splice(index,1)
        }
        if(this.language=='en'){
          this.toastr.info('Plan Deleted Successfully')
        }
        else{
          this.toastr.info('تم حذف الخطة بنجاح.')
        }
        this.closeModal()

      }

    }))
  
}
DeleteAdminFeature(id:any){
    this.subs.add(this.http.deleteReq(`api/admin/features/${id}`).subscribe({
      next:res=>{

      },complete:()=>{
        const index=this.RowsData.findIndex((c:any)=>c.id == id)
        if(index>-1){
          this.RowsData.splice(index,1)
        }
        if(this.language=='en'){
          this.toastr.info('Feature Deleted Successfully')
        }
        else{
          this.toastr.info('تم حذف الميزة بنجاح.')
        }
        this.closeModal()

      }

    }))
  
}
DeleteAdminTemplates(id:any){
    this.subs.add(this.http.deleteReq(`api/admin/templates/${id}`).subscribe({
      next:res=>{

      },complete:()=>{
        const index=this.RowsData.findIndex((c:any)=>c.id == id)
        if(index>-1){
          this.RowsData.splice(index,1)
        }
        if(this.language=='en'){
          this.toastr.info('Template Deleted Successfully')
        }
        else{
          this.toastr.info('تم حذف القالب بنجاح.')
        }
        this.closeModal()

      }

    }))
  
}
DeleteAdminArticle(id:any){
  this.subs.add(this.http.deleteReq(`api/admin/blogs/${id}`).subscribe({
    next:res=>{

    },complete:()=>{
      const index=this.RowsData.findIndex((c:any)=>c.id == id)
      if(index>-1){
        this.RowsData.splice(index,1)
      }
      if(this.language=='en'){
        this.toastr.info('Article Deleted Successfully')
      }
      else{
        this.toastr.info('تم حذف المقال بنجاح.')
      }
      this.closeModal()

    }

  }))

}

DeleteAdminCity(id:any){
  this.subs.add(this.http.deleteReq(`api/admin/cities/${id}`).subscribe({
    next:res=>{

    },complete:()=>{
      const index=this.RowsData.findIndex((c:any)=>c.id == id)
      if(index>-1){
        this.RowsData.splice(index,1)
      }
      if(this.language=='en'){
        this.toastr.info('City Deleted Successfully')
      }
      else{
        this.toastr.info('تم حذف المدينة بنجاح.')
      }
      this.closeModal()

    }

  }))

}

DeleteAdminDurations(id:any){
  // todo change delete durations
  this.subs.add(this.http.deleteReq(`api/admin/durations/${id}`).subscribe({
    next:res=>{

    },complete:()=>{
      const index=this.RowsData.findIndex((c:any)=>c.id == id)
      if(index>-1){
        this.RowsData.splice(index,1)
      }
      if(this.language=='en'){
        this.toastr.info('City Deleted Successfully')
      }
      else{
        this.toastr.info('تم حذف المدينة بنجاح.')
      }
      this.closeModal()

    }

  }))

}

DeleteAdminCategory(id:any){
  // todo
  this.subs.add(this.http.deleteReq(`api/admin/expenses/${id}`).subscribe({
    next:res=>{

    },complete:()=>{
      const index=this.RowsData.findIndex((c:any)=>c.id == id)
      if(index>-1){
        this.RowsData.splice(index,1)
      }
      if(this.language=='en'){
        this.toastr.info('Category Deleted Successfully')
      }
      else{
        this.toastr.info('تم حذف التصنيف بنجاح.')
      }
      this.closeModal()

    }

  }))

}

DeleteAdminActivities(id:any){
  this.subs.add(this.http.deleteReq(`api/admin/business_types/${id}`).subscribe({
    next:res=>{

    },complete:()=>{
      const index=this.RowsData.findIndex((c:any)=>c.id == id)
      if(index>-1){
        this.RowsData.splice(index,1)
      }
      if(this.language=='en'){
        this.toastr.info('Activity Deleted Successfully')
      }
      else{
        this.toastr.info('تم حذف النشاط بنجاح.')
      }
      this.closeModal()

    }

  }))

}
DeleteAdminEntities(id:any){
  this.subs.add(this.http.deleteReq(`api/admin/company_types/${id}`).subscribe({
    next:res=>{

    },complete:()=>{
      const index=this.RowsData.findIndex((c:any)=>c.id == id)
      if(index>-1){
        this.RowsData.splice(index,1)
      }
      if(this.language=='en'){
        this.toastr.info('Company Type Deleted Successfully')
      }
      else{
        this.toastr.info('تم حذف الكيان بنجاح.')
      }
      this.closeModal()

    }

  }))

}
deletePurchaseUser(uuid:any){
  // this.subs.add(this.http.deleteReq(`api/dashboard/purchasings/${uuid}`,this.formDataPayLoad).subscribe({
  this.subs.add(this.http.postReq(`api/dashboard/destroy/purchasings/${uuid}`,this.formDataPayLoad).subscribe({
    next:res=>{

    },complete:()=>{
      const index=this.RowsData.findIndex((c:any)=>c.uuid == uuid)
      if(index>-1){
        this.RowsData.splice(index,1)
      }
      if(this.language=='en'){
        this.toastr.info('Purchase Deleted Successfully')
      }
      else{
        this.toastr.info('تم حذف المشتري بنجاح.')
      }
      this.closePurchase();

    }

  }))

}

  deleteEvent:any
  CancelEvent:any
    deletePopupevent(event:any){
      if(event.delete==true){
        this.deleteEvent=true
        this.CancelEvent=false
        if(this.nameToDelete=='DeleteAdminUser'){
          this.deleteAdminProduct(this.uuidToDelete)
        }
        else if(this.nameToDelete=='DeleteAdminSubscription'){
          this.deleteAdminPlan(this.uuidToDelete)
        }
        else if (this.nameToDelete=='DeleteAdminRole'){
          this.deleteAdminRole(this.uuidToDelete)
        }
        else if( this.nameToDelete=='DeleteAdminCoupon'){
           this.deleteAdminCoupon(this.uuidToDelete)
        }
        else if(this.nameToDelete=='DeleteAdminPlan'){
             this.DeleteAdminPlan(this.uuidToDelete)
        }
        else if (this.nameToDelete=='DeleteAdminFeature'){
          this.DeleteAdminFeature(this.uuidToDelete)
        }
        else if (this.nameToDelete=='DeleteAdminTemplates'){
          this.DeleteAdminTemplates(this.uuidToDelete)
        }
        else if (this.nameToDelete=='DeleteAdminArticle'){
          this.DeleteAdminArticle(this.uuidToDelete)
        }
        else if (this.nameToDelete=='DeleteAdminCity'){
          this.DeleteAdminCity(this.uuidToDelete)
        }
        else if (this.nameToDelete=='DeleteAdminDurations'){
          this.DeleteAdminDurations(this.uuidToDelete)
        }
        else if (this.nameToDelete=='DeleteAdminCategory'){
          this.DeleteAdminCategory(this.uuidToDelete)
        }
        else if (this.nameToDelete=='DeleteAdminActivities'){
          this.DeleteAdminActivities(this.uuidToDelete)
        }
        else if (this.nameToDelete=='DeleteAdminEntities'){
          this.DeleteAdminEntities(this.uuidToDelete)
        }
        else if (this.nameToDelete=='DeleteProduct'){
          this.deleteProduct(this.uuidToDelete)
        }
        else if (this.nameToDelete=='CancelInvoice'){
          this.deleteInvoice(this.uuidToDelete)
        }
        else if (this.nameToDelete=='deletePurchaseUser'){
          this.deletePurchaseUser(this.uuidToDelete)
        }
        else if (this.nameToDelete=='deleteClinet'){
          this.deleteClient(this.uuidToDelete)
        }
        else if (this.nameToDelete=='deleteSupplier'){
          this.deleteSupplier(this.uuidToDelete)
        }
        else if (this.nameToDelete=='deleteBank'){
          this.deleteBank(this.uuidToDelete)
        }

        else if (this.nameToDelete=='DeleteAdminDuration'){
          this.deleteDuration(this.uuidToDelete)
        }
      }
      else{
        this.deleteEvent=false
        this.CancelEvent=true
      }
    }
    uuidToDelete:any
    nameToDelete:any

    purchase_uuId = ''; 
    purchaseIndex = -1;
    purchase_currency_is_sar  = 1;
    @ViewChild('openDeleteModal') openDeleteModal!: ElementRef<HTMLElement>;
    openModel(uuid:any,name:any){
      this.uuidToDelete=uuid
      this.nameToDelete=name
      let el: HTMLElement = this.openDeleteModal.nativeElement;
        el.click();
    }

    formDataPayLoad = new FormData();
    @ViewChild('DeletePurchaseModalBtn') DeletePurchaseModalBtn!: ElementRef<HTMLElement>;
    openPurchaseModel(uuid:any,name:any){
      this.uuidToDelete=uuid
    
      this.nameToDelete=name
      let el: HTMLElement = this.DeletePurchaseModalBtn.nativeElement;
        el.click();
    }
    @ViewChild('closeDeleteModal') closeDeleteModal!: ElementRef<HTMLElement>;
    closeModal(){
      let el: HTMLElement = this.closeDeleteModal.nativeElement;
        el.click();
    }

    @ViewChild('closePurchaseModal') closePurchaseModal!: ElementRef<HTMLElement>;
    closePurchase(){
      let el: HTMLElement = this.closePurchaseModal.nativeElement;
        el.click();
    }

  deleteBank(bankUuid:any){

    this.subs.add(this.http.deleteReq(`api/dashboard/settings/banks/${bankUuid}`).subscribe({
      next:res=>{

      },complete:()=>{
        const index=this.RowsData.findIndex((c:any)=>c.uuid == bankUuid)
        if(index>-1){
          this.RowsData.splice(index,1)
        }
        if(this.language=='en'){
          this.toastr.info('Bank Deleted Successfully')
        }
        else{
          this.toastr.info('تم حذف البنك بنجاح.')
        }
      }

    }))
  }
  clickedUuid:any
  verifayAccount(uuid:string){
    this.clickedUuid=''
 this.subs.add(this.http.getReq(`api/admin/account/email/verify/${uuid}`).subscribe({
  next:res=>{

  },complete:()=>{
this.clickedUuid=uuid
  }
 }))
  }
userData:any

  openUser(uuid:string){
    this.subs.add(this.http.getReq(`api/admin/users/${uuid}/login_as`).subscribe({
      next:res=>{
        this.userData=res

        let lang = localStorage.getItem('currentLang')
        localStorage.clear()
        localStorage.setItem('currentLang',lang?lang:'ar')
        this.authSer.setUserToken(this.userData?.access_token)   
        this.authSer.setUserObj(this.userData?.user)

        if(!res?.user?.is_verified)  this.router.navigate(['/auth/register-step2'])
        else if(!res?.user?.is_completed)  this.router.navigate(['/auth/register-step3'])
        else{
          localStorage.setItem('default_template_id',this.userData?.user.default_template_id)
          localStorage.setItem('primaryColor',this.userData?.user.button_primary_color)
          localStorage.setItem('secondaryColor',this.userData?.user.button_secondary_color)
          localStorage.setItem('dashboardColor',this.userData?.user.website_color)
          localStorage.setItem('invoiceColor',this.userData?.user.invoice_color)
          localStorage.setItem('logo',this.userData?.user?.media?.logo)
          this.authSer.updateAuthUser(res?.user);

          if(res?.user.role=='user'){
            this.router.navigate(['/user/control/dashboard'])
          }
          else{
            this.router.navigate(['/admin/control/dashboard'])
          }
        }
         
     

      },complete:()=>{
       

      }
    }))
  }

  goToAddInvoice(param:string , value:string){
    this.router.navigate(['/user/invoices/Add-invoices'], { queryParams: { [param] : value} });
  }




  fileName:string = ''
  fileUrl:any = '';
  fileChoosed:any;
  fileType = '';
  removeItem(){
    this.fileName=''
    this.fileUrl = '';
    this.fileChoosed = null;
    this.formDataPayLoad.delete('file');
  
  }
  isImageFile(file: File): boolean {
    return file.type.match('image.*') != null;
  }

  isPdfFile(file: File): boolean {
    return file.type === 'application/pdf';
  }
  getImagePreview(file: File): string {
    // Assuming you're creating an object URL for the image preview
    if(file)
    return URL.createObjectURL(file);

    return '';
}

getFileType(fileUrl: string): string {
  if (fileUrl.endsWith('.pdf')) {
    this.fileName = this.extractFileName(fileUrl) || '';
    return 'pdf';
  } else if (fileUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
    return 'image';
  }
  return 'unknown';
}
extractFileName(url:string) {
  return url.split('/').pop();
}

onFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    this.fileChoosed = input.files[0];
    this.fileName = input.files[0].name;
    const objectUrl = URL.createObjectURL(input.files[0]);
    console.log(objectUrl)
    this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl); // Sanitize the URL
    if( this.isImageFile(this.fileChoosed))this.fileType = 'image';
    else if( this.isPdfFile(this.fileChoosed))this.fileType = 'pdf';
    this.formDataPayLoad.append("file", input.files[0]);
    // this.toasterService.success('File selected!');
  }
}
onDrop(event: DragEvent): void {

  event.preventDefault();
  const files = event.dataTransfer?.files;
  if(files && files[0]) {
    this.fileChoosed = files[0];
    this.fileName = files[0].name;
    const objectUrl = URL.createObjectURL(files[0]);
    console.log(objectUrl)
    this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl); // Sanitize the URL
    if( this.isImageFile(this.fileChoosed))this.fileType = 'image';
    else if( this.isPdfFile(this.fileChoosed))this.fileType = 'pdf';
    this.formDataPayLoad.append("image", files[0]);
  }
}


onDragOver(event: Event): void {
  event.stopPropagation();
  event.preventDefault();
}
onDragLeave(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
}



}