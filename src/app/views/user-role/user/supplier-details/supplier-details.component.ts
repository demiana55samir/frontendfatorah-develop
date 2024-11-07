import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { supplier } from '@modules/supplier';
import { CopyContentService } from '@services/copy-content';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss']
})
export class SupplierDetailsComponent implements OnInit {

  supplierUuid:any
  supplierDetails:supplier = {} as supplier;
  sendToClientForm!:FormGroup
  private subs=new Subscription()
  type:any
  disableEmail=false
  htmlPage: any;
  viewOnly=true

  constructor(private http:HttpService, 
    private activeRoute:ActivatedRoute,private toastr:ToastrService) { }

  ngOnInit() {
    this.supplierUuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
    this.type= String(this.activeRoute.snapshot.paramMap.get('type'))

    this.getSupplierDetails()
  }

  getSupplierDetails(){
    this.subs.add(this.http.getReq(`api/dashboard/suppliers/${this.supplierUuid}`).subscribe({
      next:res =>{
        this.supplierDetails=res.data
      },complete:()=>{
        setTimeout(()=>{
        },400)
      }
    }))
  }


}
