import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Download_pdfService } from '@services/download_pdf.service';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-invoice-details',
  templateUrl: './user-invoice-details.component.html',
  styleUrls: ['./user-invoice-details.component.scss']
})
export class UserInvoiceDetailsComponent implements OnInit {
  invoiceUuid:any
  invoice:any
  totalTax:number=0
  totalWithoutTax:number=0
  logo:string=''
  invoiceColor:string=''
  default_template_id:number=7
  currentCompanyLogo:any
  private subs=new Subscription()
  constructor(private activatedRoute:ActivatedRoute,private http:HttpService,
    private router:Router , private download_pdfService:Download_pdfService) { }

  ngOnInit() {
    this.invoiceUuid = String(this.activatedRoute.snapshot.paramMap.get('uuid'))
    if(localStorage.getItem('invoiceColor')){
      this.invoiceColor=String(localStorage.getItem('invoiceColor'))
    }
    else{
      this.invoiceColor='#6610f2'
    }
    // this.default_template_id=Number(localStorage.getItem('default_template_id'))
    this.getInvoiceDetails(this.invoiceUuid)
  }

  getInvoiceDetails(uuid:string){
    let url=`api/admin/invoices/${uuid}/preview`
  this.subs.add(this.http.getReq(url).subscribe({
    next:res=>{
  this.invoice=res.data
  this.currentCompanyLogo=res.data.logo
  this.logo=res.data.logo
    },complete:()=>{
      this.getTotalValues()
    }
  }))
    }
    getTotalValues(){
      this.invoice.products.forEach((element:any) => {
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
@ViewChild('downloadsimpleBtn') downloadsimpleBtn!: ElementRef<HTMLElement>;
downloadSimplePdfBtn() {
    let el: HTMLElement = this.downloadsimpleBtn.nativeElement;
    el.click();
}
downloadSimplePdf(){
  this.download_pdfService.downloadSimplifiedInvoice(this.invoice.uuid);


  //  this.downloadBoo = true ;
  //  setTimeout(() => {
  //   this.downloadSimplePdfBtn()
  //  }, 300);
  }

}
