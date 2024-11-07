import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { receipt } from '@models/receipt';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { CopyContentService } from '@services/copy-content';
import { Download_pdfService } from '@services/download_pdf.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-receipt-voucher-details',
  templateUrl: './receipt-voucher-details.component.html',
  styleUrls: ['./receipt-voucher-details.component.scss']
})
export class ReceiptVoucherDetailsComponent implements OnInit {
  private subs=new Subscription()
  receipt:receipt ={} as receipt
  receiptUuid:any
  myAngularxQrCode: string = '';
  invoiceColor:any
  default_template_id = 1
  language:any
  sendToClientForm!:FormGroup;
  constructor(private http:HttpService,private changelang:ChangeLanguageService,
    private activeRoute:ActivatedRoute,private router:Router,
    private fb:FormBuilder,private copier:CopyContentService,
    private toastr:ToastrService,private download_pdfService:Download_pdfService) {
    this.receiptUuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))

   }

  ngOnInit() {
    this.language=this.changelang.local_lenguage
    this.invoiceColor=String(localStorage.getItem('invoiceColor'))
    // this.default_template_id=Number(localStorage.getItem('default_template_id'))
    this.sendToClientForm=this.fb.group({
      email:['',Validators.required]
    })
    this.getReceipt()
  }
  getReceipt(){
    this.subs.add(this.http.getReq(`api/dashboard/receipts/${this.receiptUuid}`).subscribe({
      next:res =>{
        this.receipt=res.data;
        this.myAngularxQrCode =  res.data?.qr_code;
      }
    }))
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
      value:this.receipt?.customer_name
    },
    {
      tag:2,
      value:this.receipt?.tax_number
    },
    {
      tag:3,
      value:this.receipt?.created_at
    },
    {
      tag:4,
      value:null
    },
    {
      tag:5,
      value:null
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
  downloadBoo=false
@ViewChild('downloadBtn') downloadBtn!: ElementRef<HTMLElement>;
downloadPdfBtn() {
    let el: HTMLElement = this.downloadBtn.nativeElement;
    el.click();
}
downloadPdf(){
  this.download_pdfService.downloadReceipts(this.receipt.uuid)  //  this.downloadBoo = true ;
  //  setTimeout(() => {
  //   this.downloadPdfBtn()
  //  }, 300);
  }
  @ViewChild('shareModel') shareModel!: ElementRef<HTMLElement>;
  @ViewChild('textInput') textInput!: ElementRef;
  openModal(event:any) {
    let frontBaseURL = environment.frontBaseUrl;
    this.textInput.nativeElement.value = frontBaseURL + '/' +this.router.url
    let el: HTMLElement = this.shareModel.nativeElement;
      el.click();
  }

  copyLink(event:any){
  
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

sendToclient(){
  if(this.sendToClientForm.valid && this.sendToClientForm.dirty){
    this.subs.add(this.http.postReq(`api/dashboard/receipts/${this.receiptUuid}/send`,this.sendToClientForm.value).subscribe({
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
}
