import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-step3',
  templateUrl: './register-step3.component.html',
  styleUrls: ['./register-step3.component.scss']
})
export class RegisterStep3Component implements OnInit {
  InfoForm!:FormGroup
  private subs=new Subscription()
  cities:any[]=[]
  company_type:any[]=[]
  selectedTypes1 = '1';
  changed=false
  business_types:any[]=[]
  accountName={
    ar:'',
    en:''
  }

  invoices_types=[
    {
      id:'1',
      img:'./assets/images/invoices/taxable_white.svg',
      name_ar:'فاتورة ضريبية',
      name_en:'Tax invoice',
    },
    {
      id:'0',
      img:'./assets/images/invoices/nonTaxable_white.svg',
      name_ar:'فاتورة غير ضريبية',
      name_en:'Non-tax invoice',
    },
]
sales_type=[
  {
    id:1,
    img:'./assets/images/products/product_white.svg',
    name_ar:' منتج ',
    name_en:' product ',
    checked:false
  },
  {
    id:2,
    img:'./assets/images/products/service_white.svg',
    name_ar:' خدمة ',
    name_en:' service ',
    checked:false
  },
]
  constructor(private fb:FormBuilder,private changelang:ChangeLanguageService,private http:HttpService,private router:Router,private toastr:ToastrService) { }
  language:any
  ngOnInit() {
    this.language=this.changelang.local_lenguage
    this.getData()
    this.InfoForm=this.fb.group({
      account_name:['',Validators.required],
      city_id: ['',Validators.required],
      company_type_id: ['',Validators.required],
      business_type_id: ['',Validators.required],
      is_taxable: ['',Validators.required],
      offering: ['',Validators.required],
      tax_number:['',Validators.compose([Validators.required,Validators.minLength(15),Validators.maxLength(15)])],
      commercial_registration_number:['',Validators.compose([Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]*$')])]
    })
  }
  getData(){
    this.subs.add(this.http.getReq('api/dashboard/settings/cities').subscribe({
      next:res=>{
    this.cities=res.data.data
      }
    }))
    this.subs.add(this.http.getReq('api/dashboard/settings/business_types').subscribe({
      next:res=>{
      this.business_types=res.data.data
      }
    }))
    this.subs.add(this.http.getReq('api/dashboard/settings/company_types').subscribe({
      next:res=>{
      this.company_type=res.data.data
      }
    }))
  }
  
  addInfo(){
    let params: any = {};
    for (const key in this.InfoForm.value) {
      const value = this.InfoForm.value[ key ];
      if (value !== null && value !== undefined && value !== '') {
        params[ key ] = value;
      }
    }
   
    let saleType:any
    if(this.sales_type[1].checked && this.sales_type[0].checked){
      saleType=["service","product"]
    }
    else if(this.sales_type[1].checked){
      saleType=["service"]
    }
    else if(this.sales_type[0].checked) {
      saleType=["product"]
    }
    else{
      this.InfoForm.controls['offering'].setValue('')
      params['offering']=''
    }
    params['offering']=saleType
    params['is_taxable']=this.selectedTypes1
    this.InfoForm.controls['offering'].setValue(saleType)
    this.InfoForm.controls['is_taxable'].setValue(this.selectedTypes1)
    if(this.selectedTypes1=='1'){
      this.InfoForm.controls['is_taxable'].setValue(1)
      params['is_taxable']='1'

    }
    else{
      this.InfoForm.controls['is_taxable'].setValue(0)
      params['is_taxable']='0'
      this.InfoForm.removeControl('tax_number');
      this.InfoForm.removeControl('commercial_registration_number');
    }
    
    if(this.InfoForm.valid && this.InfoForm.dirty){
      this.accountName.ar=this.InfoForm.controls['account_name'].value
      this.accountName.en=this.InfoForm.controls['account_name'].value
      // this.InfoForm.controls['account_name'].setValue(this.accountName)
      params['account_name']=this.accountName
      this.subs.add(this.http.postReq('api/auth/account/complete',params).subscribe({
        next:res=>{
  
        },complete:()=>{
          this.router.navigate(['/auth/register-step4'])
        },error:()=>{
          this.InfoForm.controls['account_name'].setValue(this.accountName.ar)
          const newFormControl = new FormControl('');
          this.InfoForm.addControl('tax_number',newFormControl); 
          this.InfoForm.addControl('commercial_registration_number',newFormControl); 
        }
      }))
    }
    else{
      // this.InfoForm.controls['account_name'].setValue(this.accountName.ar)
      this.InfoForm.markAllAsTouched()
    }
  }

  check(index:number){
    this.sales_type[index].checked=!this.sales_type[index].checked
  }

}
