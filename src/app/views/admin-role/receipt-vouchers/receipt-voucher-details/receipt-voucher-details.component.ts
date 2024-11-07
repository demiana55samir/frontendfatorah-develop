import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  default_template_id:any
  language:any
  sendToClientForm!:FormGroup
  constructor(private http:HttpService,private changelang:ChangeLanguageService,
    private activeRoute:ActivatedRoute,private router:Router,
    private fb:FormBuilder,private download_pdfService:Download_pdfService) {
    this.receiptUuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))

   }

  ngOnInit() {
    this.language=this.changelang.local_lenguage
    this.invoiceColor=String(localStorage.getItem('invoiceColor'))
    this.default_template_id=Number(localStorage.getItem('default_template_id'))
    this.getReceipt()
  }

  getReceipt(){
    this.subs.add(this.http.getReq(`api/admin/receipts/${this.receiptUuid}/preview`).subscribe({
      next:res =>{
        this.receipt=res.data
      }
    }))
  }


  


  

//   downloadBoo=false
// @ViewChild('downloadBtn') downloadBtn!: ElementRef<HTMLElement>;
// downloadPdfBtn() {
//     let el: HTMLElement = this.downloadBtn.nativeElement;
//     el.click();
// }
downloadPdf(){
  this.download_pdfService.downloadReceipts(this.receipt.uuid)
  //  this.downloadBoo = true ;
  //  setTimeout(() => {
  //   this.downloadPdfBtn()
  //  }, 300);
  }







}
