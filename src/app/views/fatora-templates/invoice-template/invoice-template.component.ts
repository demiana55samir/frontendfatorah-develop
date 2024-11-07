import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { product } from '@models/product';
import { userInvoice } from '@models/user-invoices';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpService } from '@services/http.service';
import { quotations } from '@models/quotations';
import { creditNotes } from '@models/credit-notes';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralService } from '@services/general.service';
import jspdf from 'jspdf';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { InvoicesService } from '@services/invoices.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
// import domToImage from 'dom-to-image';

var Buffer = require('buffer/').Buffer;
@Component({
  selector: 'app-invoice-template',
  templateUrl: './invoice-template.component.html',
  styleUrls: ['./invoice-template.component.scss']
})
export class InvoiceTemplateComponent implements OnInit ,OnChanges{
  private subs=new Subscription()
  @Input() InvoiceType:number=4
  @Input() invoiceColor:string=''
  @Input() tempType:any
  @Input() logoUrl:string=''
  logo:any
  note:any
  @Input() invoice:any
   @Input() downloadBoolean:boolean = false
   myAngularxQrCode: string = '';

  @ViewChild('toDownload') htmlPage!: ElementRef;
  // @ViewChild('toDownload', { static: true }) htmlPage!: ElementRef;
  content:any;
  products:any[] = [];
bank_accounts: any[] = []
display=false

language:any
  constructor(private http:HttpService,private activeRoute:ActivatedRoute,private generalService:GeneralService,
    private ngxService: NgxUiLoaderService,
    private changeLang:ChangeLanguageService,
    public invoiceService : InvoicesService) { }
  default_template_id:any
  uuid:any
  type:any
  currentDate:any
  ngOnInit() {
    this.currentDate = new Date();
    this.language=this.changeLang.local_lenguage
    this.getGeneralData()
  

      document.documentElement.style.setProperty('--invoiceColor',this.invoiceColor);
      // this.getTotalValues()

   }
   changes:any
   ngOnChanges(changes:SimpleChanges):void{
    if(changes['invoice']){
      this.display=true
      this.getTotalValues()
      // console.log(this.invoice);
      
      if(this.invoice?.notes){
        this.note=this.invoice?.notes
      }
     this.changes=true
      // console.log(this.invoice.products)
      if(this.tempType!='AdminInvoice'){
        // this.myAngularxQrCode = this.generateQrCode()
        // console.log('invoice : ' , this.invoice);
        
        this.myAngularxQrCode = this.invoice?.qr_code;

      }
    }

    if(changes['InvoiceType']){
      this.InvoiceType=this.InvoiceType
    }
   }


  


  freezeScroll() {
    document.body.style.overflow = 'hidden';
  }
  unfreezeScroll() {
    document.body.style.overflow = 'auto'; // or 'scroll', depending on your requirement
  }

// try 1
// downloadPDF1() {
//   console.log('invoice : ' , this.invoice);
//   this.freezeScroll() 
//     this.downloadBoolean = true;
//     const content = this.htmlPage?.nativeElement;
//     setTimeout(() => {
//       // this.downloadBoolean = false;
//       this.unfreezeScroll()
//     }, 50);
//     // setTimeout(() => {

      
//       html2canvas(content, {
//         scale: 2,
//         allowTaint: true,
//         useCORS: true
//       }).then(canvas => {
//         const imgWidth = 210;  // A4 width in mm
//         const pageHeight = 297;  // A4 height in mm
        
//         const imgHeight = canvas.height * imgWidth / canvas.width;
//         let heightLeft = imgHeight;
  
//         const doc = new jsPDF('p', 'mm', 'a4');

//         let position = 0;
      
        
//         // Add canvas to the PDF
//         doc.addImage(canvas.toDataURL("image/jpeg"), 'JPEG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;


//         while (heightLeft>=160) {
//           position = heightLeft - imgHeight ;
//           doc.addPage();
//           doc.addImage(canvas.toDataURL("image/jpeg"), 'JPEG', 0, position, imgWidth, imgHeight);
//           heightLeft -= pageHeight;
//         }

//         doc.save('Invoice.pdf');

//          // Create a Blob from the PDF
//         // const pdfBlob = doc.output('blob');
//         // const pdfUrl = URL.createObjectURL(pdfBlob);
//         // const downloadLink = document.createElement('a');
//         // downloadLink.href = pdfUrl;
//         // downloadLink.target='_blank'
//         // downloadLink.download = 'Invoice.pdf';
//         // document.body.appendChild(downloadLink);
//         // downloadLink.click();
//         // document.body.removeChild(downloadLink);
    

//         // this.downloadBoolean = false;
//       });
  

        

//     // }, 300);
//   }

// async downloadPDF11() {
//   // this.freezeScroll();
//   this.downloadBoolean = true;
//   const content = this.htmlPage.nativeElement;
//   const breakPages = content.querySelectorAll('.pageBreak');

//   // setTimeout(() => {
//   //   this.unfreezeScroll();
//   //   this.downloadBoolean = false;
//   // }, 1000);

//   const doc = new jsPDF('p', 'mm', 'a4');
//   const imgWidth = 210;  // A4 width in mm
//   let firstPage = true;

//   for (const breakPage of breakPages) {
//     const canvas = await html2canvas(breakPage, {
//       scale: 2,
//       allowTaint: true,
//       useCORS: true
//     });

//     // const imgHeight = 279;
//     const imgHeight = canvas.height * imgWidth / canvas.width;
//     let heightLeft = imgHeight;
    
//     const position = 0; // Always start at the top of the page for new canvas

//     if (!firstPage) {
//       doc.addPage(); // Add a new page if it's not the first canvas
//     }

//     doc.addImage(canvas.toDataURL("image/jpeg"), 'JPEG', 0, position, imgWidth, imgHeight);
//     firstPage = false;
//   }

//   doc.save('Invoice.pdf');
// }
  
// async downloadPDFperfect() {
//   this.downloadBoolean = true;
//   const content = this.htmlPage.nativeElement;
//   const breakPages = content.querySelectorAll('.pageBreak');
//   const doc = new jsPDF('p', 'mm', 'a4');
//   const imgWidth = 210;  // A4 width in mm
//   const pageHeight = 297;  // A4 height in mm
//   let firstPage = true;

//   for (const breakPage of breakPages) {
//     const canvas = await html2canvas(breakPage, {
//       scale: 2,
//       allowTaint: false,
//       useCORS: true
//     });

//     const imgHeight = canvas.height * imgWidth / canvas.width;
//     let heightLeft = imgHeight;

//     while (heightLeft >= 160) {
//       const position = heightLeft >= pageHeight ? (imgHeight - heightLeft) : 0;
//       if (!firstPage) {
//         doc.addPage();
//       }

//       doc.addImage(canvas.toDataURL("image/jpeg"), 'JPEG', 0, position, imgWidth, Math.min(pageHeight, heightLeft));
//       firstPage = false;
//       heightLeft -= pageHeight;
//     }
//   }

//   doc.save('Invoice.pdf');
// }

async downloadPDF() {
  // console.log('invoice : ' , this.invoice);
  this.ngxService.start()
   this.freezeScroll();
  this.downloadBoolean = true;
  this.invoiceService.downloadShow = true;
   try {
    setTimeout(async () => {
      const content = this.htmlPage.nativeElement;
      const breakPages = content.querySelectorAll('.pageBreak');
     
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;  // A4 width in mm
      const pageHeight = 297;  // A4 height in mm
      let firstPage = true;
    
      for (const breakPage of breakPages) {
        const canvas = await html2canvas(breakPage, {
          scale: 2,
          allowTaint: true,
          useCORS: true
        });
    
        // Calculate the scaled dimensions.
        const scaledWidth = canvas.width / canvas.height * pageHeight;
        const imgWidth = Math.min(scaledWidth, pageWidth);
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
    
        while (heightLeft > 0) {
          const position = heightLeft > pageHeight ? imgHeight - heightLeft : 0;
    
          if (!firstPage) {
            doc.addPage();
          }
    
          // Adjust the horizontal position based on the scaled width.
          const xPosition = (pageWidth - imgWidth) / 2;
          doc.addImage(canvas.toDataURL("image/jpeg"), 'JPEG', xPosition, position, imgWidth, Math.min(pageHeight, heightLeft));
          
          firstPage = false;
          heightLeft -= pageHeight;
        }
      }
    
      doc.save('Invoice.pdf');
      setTimeout(() => {
        this.unfreezeScroll();
        // this.downloadBoolean = false;
        // this.invoiceService.downloadShow = false;
        this.ngxService.stop();
      }, 400);
    }, 100);
  } catch (error) {
    this.unfreezeScroll();
    // this.downloadBoolean = false;
    // this.invoiceService.downloadShow = false;
    this.ngxService.stop();
  }
  
}


  totalTax:any=0
  totalWithoutTax:any=0

  getTotalValues(){
    this.invoice?.products?.forEach((element:any) => {
      if(this.tempType=='invoice' || this.tempType=='credit'){
        if(element.tax){
          // console.log(element.tax)
          this.totalTax=this.totalTax+((element.tax/100)*((Number(element.price)*Number(element.quantity))-Number(element.discount)))
        }
        if(element.price && element.discount && element.quantity){
          this.totalWithoutTax= this.totalWithoutTax+(element.price*element.quantity)-element.discount
        }
        else if(element.price && element.quantity){
          this.totalWithoutTax= this.totalWithoutTax+(element.price*element.quantity)
  
        }

      }
      else{
        if(element?.pivot?.tax){
          this.totalTax=this.totalTax+((element.pivot?.tax/100)*((Number(element.pivot?.price)*Number(element.pivot.quantity))-Number(element.pivot.discount)))
        }
        if(element.pivot?.price && element.pivot.discount && element.pivot.quantity){
          this.totalWithoutTax= this.totalWithoutTax+(element.pivot?.price*element.pivot.quantity)-element.pivot.discount
        }
        else if(element.pivot?.price && element.pivot.quantity){
          this.totalWithoutTax= this.totalWithoutTax+(element.pivot?.price*element.pivot.quantity)
  
        }
      }
    });
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
      value:this.invoice?.products?.reduce((sum:any, product:any) => sum + product?.tax, 0)
    }
  ]
  if(this.tempType=='quotations'){
    QrCodeTags = [
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
       value:this.invoice?.issue_date
     },
     {
       tag:4,
       value:Number(this.invoice?.total)
     },
     {
       tag:5,
       value:this.invoice?.products?.reduce((sum:any, product:any) => sum + product.pivot?.tax, 0)
     }
   ]

  }
  if(this.tempType=='credit'){
    QrCodeTags = [
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
        value:this.invoice?.issue_date
      },
      {
        tag:4,
        value:Number(this.invoice?.total)
      },
      {
        tag:5,
        value:this.invoice?.products?.reduce((sum:any, product:any) => sum + product.tax, 0)
      }
    ]
  }
  if(this.tempType=='voucher'){
    QrCodeTags = [
      {
        tag:1,
        value:this.invoice?.customer_name
      },
      {
        tag:2,
        value:this.invoice?.customer_tax_number
      },
      {
        tag:3,
        value:this.invoice?.received_at
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
  }
    // console.log(QrCodeTags.map(tag => this.generateHexRepresentation(tag.tag,tag.value)).join(''));
    
    // const base64EncodedTags: string = window.btoa(
    //   QrCodeTags.map(tag => this.generateHexRepresentation(tag.tag,tag.value)).join('')
    // );

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

  pdfUrl: string | undefined;

  getPdf():Promise<any> {
    return new Promise((resolve, reject) => {
    this.downloadBoolean=true
    setTimeout(() => {
      // console.log(this.invoice)
      const content = this.htmlPage?.nativeElement;
      const width = this.htmlPage.nativeElement.clientWidth;
      const height = this.htmlPage.nativeElement.clientHeight;
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [width + 50, height]
        });


      html2canvas(content, {
        scale: 2,
        allowTaint: true,
        useCORS: true
      }).then(canvas => {
        const imgData = canvas.toDataURL("image/jpeg", 0.7); // Adjust quality level if needed
        const imgWidth = 110;
        const pageHeight = 650;
        const imgHeight = canvas.height * imgWidth / canvas.width;
  
        
        
        let heightLeft = imgHeight;
        let position = 0;
        let width = doc.internal.pageSize.getWidth();
        let height = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, 'JPEG', 0, position, width, height);
        heightLeft -= pageHeight;
    
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        resolve(doc.output('blob'));

      });

    }, 300);
  });
  }
  stamp:any=''
  filgrane:any
  getGeneralData(){
    let generalData =  localStorage.getItem('UserObj');
    if(generalData){
      let userData = JSON.parse(generalData);
      this.stamp = userData?.media?.signature
      if(this.tempType!='subsInvoice')this.logoUrl= userData?.media?.logo
      else this.logoUrl= './assets/logo/logo 1.svg'
      this.filgrane=userData.filgrane

    }else{
      this.subs.add(this.generalService.getGeneralData().subscribe({
        next:(res)=>{
          this.stamp = res?.data?.media?.signature
          this.logoUrl= res?.data?.media?.logo
          this.filgrane=res?.data?.filgrane
        }
      }));
    }
    // console.log(this.stamp)
   }
  

   get totalTaxes(): number {
    return this.invoice.products.reduce((sum:any, product:any) => sum + product.tax_value, 0);
}

//  getInvoice(uuid:any){
//   this.subs.add(this.http.getReq(`api/dashboard/invoices/${String(uuid)}`).subscribe({
//     next:res=>{
//       this.invoice=res.data
//     },complete:()=>{
//       this.display=true
//       this.generatePdf()
  
//     }
//   }))
//  }

}
