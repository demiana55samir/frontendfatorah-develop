import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { InvoicesService } from '@services/invoices.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-new-invoice-templates',
  templateUrl: './new-invoice-templates.component.html',
  styleUrls: ['./new-invoice-templates.component.scss']
})
export class NewInvoiceTemplatesComponent implements OnInit {
  @Input() invoice: any;
  @Input() downloadBoolean:boolean = false
  @ViewChild('toDownload') htmlPage!: ElementRef;


  myAngularxQrCode!:any
  constructor(private ngxService: NgxUiLoaderService,public invoiceService : InvoicesService) { }

  ngOnInit() {
  }
  ngOnChanges(changes:SimpleChanges):void{
    if(changes['invoice']){
        this.myAngularxQrCode = this.invoice?.qr_code;
    }
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
  // if(this.tempType=='quotations'){
  //   QrCodeTags = [
  //    {
  //      tag:1,
  //      value:this.invoice?.account_name
  //    },
  //    {
  //      tag:2,
  //      value:this.invoice?.tax_number
  //    },
  //    {
  //      tag:3,
  //      value:this.invoice?.issue_date
  //    },
  //    {
  //      tag:4,
  //      value:Number(this.invoice?.total)
  //    },
  //    {
  //      tag:5,
  //      value:this.invoice?.products?.reduce((sum:any, product:any) => sum + product.pivot?.tax, 0)
  //    }
  //  ]

  // }
  // if(this.tempType=='credit'){
  //   QrCodeTags = [
  //     {
  //       tag:1,
  //       value:this.invoice?.account_name
  //     },
  //     {
  //       tag:2,
  //       value:this.invoice?.tax_number
  //     },
  //     {
  //       tag:3,
  //       value:this.invoice?.issue_date
  //     },
  //     {
  //       tag:4,
  //       value:Number(this.invoice?.total)
  //     },
  //     {
  //       tag:5,
  //       value:this.invoice?.products?.reduce((sum:any, product:any) => sum + product.tax, 0)
  //     }
  //   ]
  // }
  // if(this.tempType=='voucher'){
  //   QrCodeTags = [
  //     {
  //       tag:1,
  //       value:this.invoice?.customer_name
  //     },
  //     {
  //       tag:2,
  //       value:this.invoice?.customer_tax_number
  //     },
  //     {
  //       tag:3,
  //       value:this.invoice?.received_at
  //     },
  //     {
  //       tag:4,
  //       value:null
  //     },
  //     {
  //       tag:5,
  //       value:null
  //     }
  //   ]
  // }
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

  get totalTaxes(): number {
    return this.invoice.products.reduce((sum:any, product:any) => sum + product.tax_value, 0);
}
freezeScroll() {
  document.body.style.overflow = 'hidden';
}
unfreezeScroll() {
  document.body.style.overflow = 'auto'; // or 'scroll', depending on your requirement
}

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
        this.invoiceService.downloadShow = false;
        this.ngxService.stop();
      }, 400);
    }, 100);
  } catch (error) {
    this.unfreezeScroll();
    // this.downloadBoolean = false;
    this.invoiceService.downloadShow = false;
    this.ngxService.stop();
  }
  
}

}
