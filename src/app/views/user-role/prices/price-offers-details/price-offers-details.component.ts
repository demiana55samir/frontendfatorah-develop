import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { bank } from '@models/bank';
import { product } from '@models/product';
import { quotations } from '@models/quotations';
import { InvoiceTemplateComponent } from '@modules/invoice-template/invoice-template.component';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { CopyContentService } from '@services/copy-content';
import { Download_pdfService } from '@services/download_pdf.service';
import { HttpService } from '@services/http.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-price-offers-details',
  templateUrl: './price-offers-details.component.html',
  styleUrls: ['./price-offers-details.component.scss']
})
export class PriceOffersDetailsComponent implements OnInit {
  private subs = new Subscription();
  quotations:quotations={} as quotations
  bank:bank[]=[]
  products:product[]=[]
  quotationsUuid=''
  totalWithoutTax=0
  totalTax=0
  language:any
  invoiceColor:string=''
  myAngularxQrCode:any
  sendToClientForm!:FormGroup
  clientEmail:any
  disableEmailInput=false
  templateNumber:any=1
  view=true
  constructor(private http:HttpService,private changeLang:ChangeLanguageService,
    private fb:FormBuilder,private activeRoute:ActivatedRoute,
    private router:Router,private copier:CopyContentService,
    private toastr:ToastrService , private download_pdfService:Download_pdfService) { 
    this.quotationsUuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))

  }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.invoiceColor=String(localStorage.getItem('invoiceColor'))
    this.templateNumber=Number(localStorage.getItem('default_template_id'))
    this.sendToClientForm=this.fb.group({
      email:['',Validators.required]
    })
    if(this.router.url.includes('/viewOnly')){
      this.getQuotations('viewOnly')
      this.view=false
      setTimeout(()=>{
        this.downloadPdf()
      },400)
    }
    else{
      this.view=true
 
      this.getQuotations('view')
    }
  }

getQuotations(type:string){
  let url=''
  if(type=='viewOnly'){
    url=`api/quotation/${this.quotationsUuid}/preview`
  }
  else{
    url=`api/dashboard/quotations/${this.quotationsUuid}`
  }
  this.subs.add(this.http.getReq(url).subscribe({
   next:res=>{
     this.quotations=res.data
     this.bank=res.data.bank_accounts
     this.products=res.data.products 
     this.products.forEach(element =>{
      element.pivot.total = Number(element.pivot.total.toFixed(2)) 
      element.pivot.tax = Number(element.pivot.tax.toFixed(2)) 
     })
     this.myAngularxQrCode =  res.data?.qr_code;
     if(res.data.client_email){
      this.disableEmailInput=true
      this.sendToClientForm.controls['email'].setValue(res.data.client_email)
     }
   },complete:()=>{

    this.getTotals()
   }
  }))

}
sendToClientData = new FormData();

pdfLoader=false
@ViewChild('quotationTemplate') quotationTemplate !: InvoiceTemplateComponent;
sendToclient(){
  if (this.sendToClientForm.valid) {
    this.pdfLoader=true
    this.sendToClientData.append('email', this.sendToClientForm.controls['email'].value);
     
    this.subs.add(this.http.postReq(`api/dashboard/quotations/${this.quotationsUuid}/send`, this.sendToClientData).subscribe({
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

    // this.quotationTemplate.getPdf().then((doc) => {
    //   this.sendToClientData.append('pdf', doc);

    //   this.subs.add(this.http.postReq(`api/dashboard/quotations/${this.quotationsUuid}/send`, this.sendToClientData).subscribe({
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
getTotals(){
  this.products.forEach(element => {
    if(element.pivot.tax){
      this.totalTax=this.totalTax+((element.pivot.tax/100)*((element.pivot.price*element.pivot.quantity)-element.pivot.discount))

      this.totalTax = Number(this.totalTax.toFixed(2));
    }
    if(element.pivot.price && element.pivot.discount && element.pivot.quantity){
      this.totalWithoutTax= this.totalWithoutTax+(element.pivot.price*element.pivot.quantity)-element.pivot.discount
      this.totalWithoutTax = Number(this.totalWithoutTax.toFixed(2));
    }
    else if(element.pivot.price && element.pivot.quantity){
      this.totalWithoutTax= this.totalWithoutTax+(element.pivot.price*element.pivot.quantity)
      this.totalWithoutTax = Number(this.totalWithoutTax.toFixed(2));
    }


  });
}

@ViewChild('shareModel') shareModel!: ElementRef<HTMLElement>;
@ViewChild('textInput') textInput!: ElementRef;
openModal(event:any) {
  let frontBaseURL = environment.frontBaseUrl;
  this.textInput.nativeElement.value=`${frontBaseURL}/user/prices/price-offers-details/viewOnly/${this.quotationsUuid}`
  let el: HTMLElement = this.shareModel.nativeElement;
    el.click();
}
copyLink(event:any){
    // this.textInput.nativeElement.value= `http://fatoraprofront.restart-technology.com/${window.location.href}/${this.router.url}`
    const text = this.textInput.nativeElement.value;
    this.textInput.nativeElement.select();
    this.copier.copyText(text);
    if(this.language == 'ar'){
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


// sendToclient(){
//   if(this.sendToClientForm.valid && this.sendToClientForm.dirty){
//     this.subs.add(this.http.postReq(`api/dashboard/quotations/${this.quotationsUuid}/send`,this.sendToClientForm.value).subscribe({
//       next:res=>{

//       },complete:()=>{
//         let el: HTMLElement = this.shareModel.nativeElement;
//         el.click();
//       }
//     }))

//   }
//   else{
//     this.sendToClientForm.markAllAsTouched()
//   }
// }
@ViewChild('toDownload') htmlPage!: ElementRef;
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

    doc.save('quotation.pdf');
  });
}
downloadBoo = false;
@ViewChild('downloadBtn') downloadBtn!: ElementRef<HTMLElement>;
downloadPdfBtn() {
    let el: HTMLElement = this.downloadBtn.nativeElement;
    el.click();
}
downloadPdf(){
  this.download_pdfService.downloadQuotations(this.quotations.uuid)
  //  this.downloadBoo = true ;
  //  setTimeout(() => {
  //   this.downloadPdfBtn()
  //  }, 300);
  }

  
  generateHexRepresentation(tag:number , value:any): string {
    let valueString = String(value)
    const hexTag = this.toHex(tag);
    const hexLength = this.toHex(valueString.length);
  
    return hexTag + hexLength + value;
  }
  
   toHex(value: number): string {
    return String.fromCharCode(value);
  }
  generateQrCode(){


   let QrCodeTags = [
     {
       tag:1,
       value:this.quotations?.account_name
     },
     {
       tag:2,
       value:this.quotations?.tax_number
     },
     {
       tag:3,
       value:this.quotations?.issue_date
     },
     {
       tag:4,
       value:Number(this.quotations?.total)
     },
     {
       tag:5,
       value:this.quotations?.products?.reduce((sum:any, product:any) => sum + product.pivot.tax, 0)
     }
   ]

  
    // console.log(QrCodeTags.map(tag => this.generateHexRepresentation(tag.tag,tag.value)).join(''));
    
    // const base64EncodedTags: string = window.btoa(
    //   QrCodeTags.map(tag => this.generateHexRepresentation(tag.tag,tag.value)).join('')
    // );
    //   console.log(base64EncodedTags);
      
    let QRCodeTagText =  QrCodeTags.map(tag => this.generateHexRepresentation(tag.tag,tag.value)).join('')
    const myBuffer = Buffer.from(QRCodeTagText);
    const base64EncodedTags: string = myBuffer.toString('base64') 
      // console.log(base64EncodedTags);
      
    return base64EncodedTags;
  }
  
  goToAddInvoice(param:string , value:string){
    this.router.navigate(['/user/invoices/Add-invoices'], { queryParams: { [param] : value} });
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
}
