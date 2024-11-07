import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { SubscriptionDataService } from '@services/subscription-data.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

interface product{
  name:string,
  type:string,
  price:number
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  addProductForm!:FormGroup
  private subs = new Subscription();

  selectedTypes = 1;
  invoices_types=[
    {
      id:1,
      img:'./assets/images/products/product.svg',
      name_ar:' منتج ',
      name_en:' product ',
    },
    {
      id:2,
      img:'./assets/images/products/service.svg',
      name_ar:' خدمة ',
      name_en:' service ',
    },
]
 name={
  ar:'',
  en:''
 }
 Type:any
 uuid:any
 currentProduct:product={} as product
  constructor(private fb:FormBuilder,private toaster:ToastrService,private userSubscription:SubscriptionDataService,
    private validationserv:ValidationService,private activeRoute:ActivatedRoute,private router:Router,
    private changeLangua:ChangeLanguageService,private http:HttpService,private toastr:ToastrService) { }
language:any
subscriptioData:any
ngOnInit() {
    this.language=this.changeLangua.local_lenguage
    this.userSubscription.GetUserSubscriptionData().subscribe({
      next:res=>{
         this.subscriptioData=res.data
      },complete:()=> {
        if(this.subscriptioData.products==0){
          if(this.language=='ar'){
            this.toastr.error('لقد تخطيت عدد المنتجات المتاحه لك')
        }
        else{
            this.toastr.error('You have exceeded the number of products available to you')
        }
          window.history.back();
        }
      },
    })
    this.addProductForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.required], // initial value for Arabic
        en: ['']  // initial value for English
      }),
      price:['',Validators.pattern(this.validationserv.floatPattern)],
      type:['',Validators.required]
    })
    this.Type=String(this.activeRoute.snapshot.paramMap.get('type'))
    this.uuid=String(this.activeRoute.snapshot.paramMap.get('uuid'))
    if(this.Type=='edit'){
      this.getProductData()
    }

  }
  addProduct(){
  this.addProductForm.controls['type'].setValue(this.invoices_types[this.selectedTypes-1].name_en)
  if(this.addProductForm.valid && this.addProductForm.dirty){
    // this.name.en=this.addProductForm.controls['name'].value
    // this.name.ar=this.addProductForm.controls['name'].value
    // this.addProductForm.controls['name'].setValue(this.name)
    this.subs.add(this.http.postReq('api/dashboard/products',this.addProductForm.value).subscribe({
      next:res=>{
        
      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('product added successfully')
        }
        else{
          this.toastr.info('تمت إضافة المنتج بنجاح')
        }
        this.addProductForm.reset();
        this.router.navigate(['/user/products/All-products'])
      },
      error:()=>{
        this.addProductForm.controls['name'].setValue(this.name.ar)
      }
    }))
  }
  else{
    this.addProductForm.markAllAsTouched();
    // this.changeLangua.scrollToTop();
    this.changeLangua.scrollToInvalidInput(this.addProductForm);
  }
  }
  product:any
  getProductData(){
    this.subs.add(this.http.getReq(`api/dashboard/products/${this.uuid}`).subscribe({
      next:res=>{
        this.product = res?.data;
        this.addProductForm.get('name')?.setValue({
          ar: res.data.name_ar,
          en: res.data.name_en
        });
        // this.currentProduct.name=res.data.name
        this.currentProduct.price=res.data.price
        this.addProductForm.patchValue(this.product)
        if(res?.data.type == 'Product' || res?.data.type == 'منتج'){
          this.addProductForm.controls['type'].setValue(1)
          this.currentProduct.type=" product "
          this.selectedTypes=1
        }
        else{
          this.addProductForm.controls['type'].setValue(2)
          this.currentProduct.type=" service "
          this.selectedTypes=2

        }

      }
    }))
  }
editProduct(){
  this.addProductForm.controls['type'].setValue(this.invoices_types[this.selectedTypes-1].name_en)
  if(this.addProductForm.valid){
    // console.log(JSON.stringify(this.currentProduct) +"-"+JSON.stringify(this.addProductForm.value))
    if(JSON.stringify(this.currentProduct) != JSON.stringify(this.addProductForm.value)){
      // this.name.en=this.addProductForm.controls['name'].value
      // this.name.ar=this.addProductForm.controls['name'].value
      // this.addProductForm.controls['name'].setValue(this.name)
      this.subs.add(this.http.putReq(`api/dashboard/products/${this.uuid}`,this.addProductForm.value).subscribe({
        next:res=>{
          
        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('product edited successfully')
          }
          else{
            this.toastr.info('تم تعديل المنتج بنجاح')
          }
          this.addProductForm.reset();
          this.router.navigate(['/user/products/All-products'])
        },error:()=>{
          this.addProductForm.controls['name'].setValue(this.name.ar)
        }
      }))

    }
    else{
      if(this.language=='en'){
        this.toaster.info('update Data first')
      }
      else{
        this.toaster.info('الرجاء تحديث البيانات أولاً')
      }
    }
  }
  else{
    this.addProductForm.markAllAsTouched();
    // this.changeLangua.scrollToTop();
    this.changeLangua.scrollToInvalidInput(this.addProductForm);
  }
}
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
