import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-debit-notes-details',
  templateUrl: './debit-notes-details.component.html',
  styleUrls: ['./debit-notes-details.component.scss']
})
export class DebitNoteDetailsAdminComponent implements OnInit {

  creditNoteUuid:any
  creditNote:any
  totalTax:number=0
  totalWithoutTax:number=0
  logo:string=''
  private subs=new Subscription()
  constructor(private activatedRoute:ActivatedRoute,private http:HttpService,private router:Router) { }

  ngOnInit() {
    this.creditNoteUuid = String(this.activatedRoute.snapshot.paramMap.get('uuid'))
    this.getCreditNoteDetails(this.creditNoteUuid)
  }

  getCreditNoteDetails(uuid:string){
    let url=`api/admin/credit_notes/${uuid}/preview`
  this.subs.add(this.http.getReq(url).subscribe({
    next:res=>{
  this.creditNote=res.data
    },complete:()=>{
      this.getTotalValues()
    }
  }))
    }
    
    getTotalValues(){
      this.creditNote.products.forEach((element:any) => {
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

}
