import { Injectable } from '@angular/core';
import { userInvoice } from '@models/user-invoices';

interface invoice{
  type:any,
  uuid:string
}
@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
cancelledInvoicess:userInvoice[]=[]
cancelleduuid:invoice[]=[]

downloadShow:boolean = false;
constructor() { }
getCancelledInvoices(){
return this.cancelledInvoicess
}
setCancelledInvoices(cancelledInvoices:userInvoice[]){
this.cancelledInvoicess=cancelledInvoices

}

getCancelledUuid(){
  this.cancelleduuid=[]
  this.cancelledInvoicess.forEach((element)=>{
    this.cancelleduuid.push({uuid:element.uuid,type:element.paid})
    })
  return this.cancelleduuid
}
}
