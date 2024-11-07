import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.scss']
})
export class QuotationDetailsComponent implements OnInit {

  quotationUuid:any
  quotation:any
  totalTax:number=0
  totalWithoutTax:number=0
  logo:string=''
  private subs=new Subscription()
  constructor(private activatedRoute:ActivatedRoute,private http:HttpService,private router:Router) { }

  ngOnInit() {
    this.quotationUuid = String(this.activatedRoute.snapshot.paramMap.get('uuid'))
    this.getInvoiceDetails(this.quotationUuid)
  }

  getInvoiceDetails(uuid:string){
    let url=`api/admin/quotations/${uuid}/preview`
  this.subs.add(this.http.getReq(url).subscribe({
    next:res=>{
  this.quotation=res.data
    },complete:()=>{
      this.getTotalValues()
    }
  }))
    }
    getTotalValues(){
      this.quotation.products.forEach((element:any) => {
        if(element.pivot.tax){
          this.totalTax=this.totalTax+((element.pivot.tax/100)*((Number(element.pivot.price)*Number(element.pivot.quantity))-Number(element.pivot.discount)))
        }
        if(element.pivot.price && element.pivot.discount && element.pivot.quantity){
          this.totalWithoutTax= this.totalWithoutTax+(element.pivot.price*element.pivot.quantity)-element.pivot.discount
        }
        else if(element.pivot.price && element.pivot.quantity){
          this.totalWithoutTax= this.totalWithoutTax+(element.pivot.price*element.pivot.quantity)
  
        }
      });
    }




}
