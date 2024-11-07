import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { client } from '@models/client';
import { addedProduct, product } from '@models/product';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
const datePipe = new DatePipe('en-EG');

@Component({
  selector: 'app-add-price-offer',
  templateUrl: './add-price-offer.component.html', 
  styleUrls: ['./add-price-offer.component.scss']
})
export class AddPriceOfferComponent implements OnInit {
  // tax=[{name:'05%',value:5},{name:'10%',value:10},{name:'15%',value:15},{name:'معفاة',value:null}]
  tax=[{name:'05%',value:5},{name:'15%',value:15},{name:'معفاة',value:null}]
  valiedproducts :addedProduct[] = []

  private subs = new Subscription();

  addPriceOfferForm!:FormGroup
  companyLogo:any=''
  
  formDataPayLoad = new FormData();
  clients!:client[]
  products!:product[]

  addedProducts=[
    {
      "product_id":null,
        "quantity":1,
        "price":0,
        "discount":0,
        "tax":15,
        "total":0,
        "totalwithoutTax":0,
        "discount_type" : 1,
        "discount_value" :0
    }
  ]

  totalWithTax=0
  totaltax=0
  total=0
  language:any
  @ViewChild('priceOfferNumber') priceOfferNumber!: ElementRef<HTMLElement>;

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent): void {
    if (document.activeElement === this.priceOfferNumber.nativeElement) {
      event.preventDefault(); // Prevent the default Enter key behavior
    }
  }

  // todo -> zeroTax
  // taxCodes = [
  //   {code: 'VATEX-SA-34-1',
  //     name:'ZERORATEDGOODS.ITEM1'
  //   },
  //   {code : 'VATEX-SA-34-2',
  //     name:'ZERORATEDGOODS.ITEM2'
  //   }, 
  //   {code : 'VATEX-SA-34-3',
  //     name:'ZERORATEDGOODS.ITEM3'
  //   }, 
  //   {code : 'VATEX-SA-34-4',
  //     name:'ZERORATEDGOODS.ITEM4'
  //   }, 
  //   {code : 'VATEX-SA-34-5',
  //     name:'ZERORATEDGOODS.ITEM5'
  //   }, 
  //   {code : 'VATEX-SA-35',
  //     name:'ZERORATEDGOODS.ITEM6'
  //   },   
  //   {code : 'VATEX-SA-36',
  //     name:'ZERORATEDGOODS.ITEM7'
  //   },   
  //   {code : 'VATEX-SA-EDU',
  //     name:'ZERORATEDGOODS.ITEM8'
  //   },  
  //   {code : 'VATEX-SA-HEA',
  //     name:'ZERORATEDGOODS.ITEM9'
  //   },  
  //   {code : 'VATEX-SA-MLTRY',
  //     name:'ZERORATEDGOODS.ITEM10'
  //   },
  //   {code : 'VATEX-SA-32',
  //     name:'ZERORATEDGOODS.ITEM11'
  //   },   
  //   {code : 'VATEX-SA-33',
  //     name:'ZERORATEDGOODS.ITEM12'
  //   },   
  // ]
  // zeroTaxBoolean:boolean = false;

  discountTypes=[
    {
      id:1,
      name_ar:'نسبة مئوية',
      name_en:'Percentage',
    },
    {
      id:2,
      name_ar:' قيمة ',
      name_en:'Value',
    },
]

  constructor(private http:HttpService,private authService:AuthService,
    private changeLanguage:ChangeLanguageService,private fb:FormBuilder,private toastr:ToastrService,private router:Router) { }

  ngOnInit() {
    this.language=this.changeLanguage.local_lenguage
    if(this.language == 'en') {
      this.tax = this.tax.map(item => {
        if (item.name === 'معفاة') {
          return {...item, name: 'Exempt'};
        }
        return item;
      });
    }
    this.getPriceNumber()
    this.getGeneralData()
    this.getAllClients()
    this.getAllProducts()
    this.addPriceOfferForm=this.fb.group({
      number:['',Validators.required],
      client_id:['',Validators.required],
      date:['',Validators.required],
      due_date:[''],
      products:[''],
      total:['',Validators.required],
      notes:this.fb.group({
        ar: [''],
        en: [''] 
      }),
      tax_exemption_code:['']
    })


    let TodayDate = new Date();
    TodayDate = new Date(this.changeLanguage.getSaudiDate(TodayDate))
    this.addPriceOfferForm.controls['date'].setValue(TodayDate);

  }
  

  validateImage(event:any) {
    this.formDataPayLoad.delete('image')
    let reader = new FileReader();
    const file:File = event.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
        // When file uploads set it to file formcontrol
        reader.onload = () => {
          this.companyLogo = reader.result;
        }
        this.formDataPayLoad.append("logo", file);
        this.subs.add(this.http.postReq('api/dashboard/settings/upload',this.formDataPayLoad).subscribe({
          next:res=>{
          //  console.log(res)
          }
       }))
    }
  }

  getPriceNumber(){
    this.subs.add(this.http.getReq('api/dashboard/quotations/create').subscribe({
      next:res=>{
        this.addPriceOfferForm.controls['number'].setValue(res?.data?.quotation_number);
      }
    }))
  }

  getAllClients(){
    // this.subs.add(this.http.getReq('api/dashboard/clients').subscribe({
     this.subs.add(this.http.getReq('api/dashboard/ajax/clients/search').subscribe({ 
      next:res=>{
        this.clients=res.data
      }
    }))
  }
  getAllProducts(){
    
    this.subs.add(this.http.getReq('api/dashboard/ajax/products/search').subscribe({
      next:res=>{
        this.products=res.data
      }
    }))
  }
  getTotalWithoutTax(index:number){
     // discount type feature
     this.addedProducts[index].discount_value = Number(this.addedProducts[index].discount_value);
     this.checkValidValue(index)

    if(this.addedProducts[index].quantity && this.addedProducts[index].price && 
      this.addedProducts[index].discount_type && this.addedProducts[index].discount_value
      ){

      
         // ------------------- discount type feature --------------------------
         if(this.addedProducts[index].discount_type == 1){
          this.addedProducts[index].discount = (Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price)) * (this.addedProducts[index].discount_value/100)
        }else{
          this.addedProducts[index].discount =  this.addedProducts[index].discount_value;
        }
        // ------------------------------------------------------------------------

      if( Number(this.addedProducts[index].discount ) < (Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price)) ){
        this.addedProducts[index].totalwithoutTax=(Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price))
        this.addedProducts[index].totalwithoutTax=this.addedProducts[index].totalwithoutTax-Number(this.addedProducts[index].discount)
        this.addedProducts[index].total=this.addedProducts[index].totalwithoutTax
      } 
      else{
        if(Number(this.addedProducts[index].discount ) >= (Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price))){
          // discount type feature
        this.addedProducts[index].discount=0
        this.addedProducts[index].discount_value=0
        }

        if(Number(this.addedProducts[index].discount)<0){
        // discount type feature
        this.addedProducts[index].discount=0
        this.addedProducts[index].discount_value=0
        }
        if(this.language=='en'){
          this.toastr.error('Value Is Invalid')
        }
        else{
          this.toastr.error('قيمة غير صحيحة')
        }
        this.addedProducts[index].totalwithoutTax=(Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price))
      }
   }
    else if(this.addedProducts[index].quantity && this.addedProducts[index].price){
       this.addedProducts[index].totalwithoutTax=((Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price)))
      this.addedProducts[index].total=this.addedProducts[index].totalwithoutTax
   }
   if(this.addedProducts[index].tax==null){
     this.addedProducts[index].total=this.addedProducts[index].totalwithoutTax
   }
   else{
     this.addedProducts[index].total=((this.addedProducts[index].tax/100)*this.addedProducts[index].totalwithoutTax)+this.addedProducts[index].totalwithoutTax
   }

   this.addedProducts[index].totalwithoutTax=Number( this.addedProducts[index].totalwithoutTax.toFixed(2));
   this.addedProducts[index].total= Number( this.addedProducts[index].total.toFixed(2));

 }
 checkValidValue(index:any){
  let invalidValueFound=false
  if(Number(this.addedProducts[index].price)<0){
    this.addedProducts[index].price=0
    invalidValueFound=true

  }
  if(Number(this.addedProducts[index].discount)<0){
    this.addedProducts[index].discount=0
    invalidValueFound=true

  }
  if(Number(this.addedProducts[index].quantity)<0){
    this.addedProducts[index].quantity=1
    invalidValueFound=true
  }
  if(invalidValueFound==true){
     if(this.language=='en'){
        this.toastr.error('Value Is Invalid')
      }
      else{
        this.toastr.error('قيمة غير صحيحة')
      }
  }
 }
 setCardData(){
  this.totaltax=0
    this.totalWithTax=0
    this.total=0
  this.addedProducts.forEach((element)=>{
    // this.totaltax=this.totaltax+element.tax
    if(element.tax){
      this.totaltax=this.totaltax+((element.tax/100)*((Number(element.price)*Number(element.quantity))-Number(element.discount)))
    }
    this.totalWithTax=this.totalWithTax+element.totalwithoutTax
    this.totalWithTax=Number(this.totalWithTax.toFixed(2))

    this.total=this.total+element.total
    this.total=Number(this.total.toFixed(2))
  }) 

   // todo -> zeroTax
  // const hasNullTax = this.addedProducts.some(product => (product.tax === null || product.tax === 0));

  //   if (hasNullTax) {
  //     this.zeroTaxBoolean = true;
  //     if(!this.addPriceOfferForm.controls['tax_exemption_code'].value){
  //       this.addPriceOfferForm.controls['tax_exemption_code'].setValue(this.taxCodes[0].code);
  //     }
  //   } else {
  //     this.zeroTaxBoolean = false;
  //   }
}
getTotal(index:number){
  this.getTotalWithoutTax(index)
  if(this.addedProducts[index].tax==null){
    this.addedProducts[index].total=this.addedProducts[index].totalwithoutTax
    this.addedProducts[index].total=Number( this.addedProducts[index].total.toFixed(2))
  }
  else{
    this.addedProducts[index].total=((this.addedProducts[index].tax/100)*this.addedProducts[index].totalwithoutTax)+this.addedProducts[index].totalwithoutTax
    this.addedProducts[index].total=Number( this.addedProducts[index].total.toFixed(2))
  }

}
setPrice(index:number,product_id:any){
  const Product_index=  this.products.findIndex((c:any)=>c.uuid==product_id)
    if(Product_index>-1){
       this.addedProducts[index].price=this.products[Product_index].price
    }
  }

deleteRowDevice(index: number) {
  this.addedProducts.splice(index, 1);
//  console.log(this.addedProducts.length) 
 this.totaltax=0
 this.totalWithTax=0
 this.total=0
  this.addedProducts.forEach((element)=>{
    if(element.tax){
      this.totaltax=this.totaltax+((element.tax/100)*((Number(element.price)*Number(element.quantity))-Number(element.discount)))
    }
    this.totalWithTax=this.totalWithTax+element.totalwithoutTax
    this.total=this.total+element.total

    this.totalWithTax=Number(this.totalWithTax.toFixed(2))
    this.total=Number(this.total.toFixed(2))
  })

  
}
increaseDevice() {
  length=this.addedProducts.length
  if(this.addedProducts[this.addedProducts.length-1].product_id && this.addedProducts[this.addedProducts.length-1].price && this.addedProducts[this.addedProducts.length-1].quantity){
    this.addedProducts.push({
      "product_id":null,
        "quantity":1,
        "price":0,
        "discount":0,
        "tax":15,
        "total":0,
        "totalwithoutTax":0,
        "discount_type" : 1,
        "discount_value" :0
    });

  }
  else{
    if(this.language=='en'){
      this.toastr.error('please Enter All Required Values First')
    }
    else{
      this.toastr.error('الرجاء إدخال جميع القيم المطلوبة أولاً')
    }
  }

    
}

logoImage:any;
profileData:any;
getGeneralData(){
  this.subs.add(this.http.getReq('api/dashboard/settings/general').subscribe({
    next:res=>{
      this.logoImage=res?.data?.media?.logo
      this.profileData=res.data;
    }
  }))
}
length:any
removeEmptyProduct(){
  this.length=this.addedProducts.length
  if((!this.addedProducts[this.length-1]?.product_id &&
     !this.addedProducts[this.length-1]?.quantity &&
     !this.addedProducts[this.length-1]?.price &&
     !this.addedProducts[this.length-1]?.discount &&
     !this.addedProducts[this.length-1]?.tax
  ) && this.length>1){
 this.addedProducts.pop()
  }

}
checkValidAddedProducts(){
  this.length=this.addedProducts.length;
  if(!this.addedProducts[this.length-1].product_id || !this.addedProducts[this.length-1].quantity || !this.addedProducts[this.length-1].price){
    return false;
  }
   return true
}

checkValidProducts(){
  this.valiedproducts = []
  // this.addedProducts.pop()
 this.removeEmptyProduct()
 this.length=this.addedProducts.length
 if(!this.addedProducts[this.length-1].product_id || !this.addedProducts[this.length-1].quantity || !this.addedProducts[this.length-1].price){
   return false
 }
 else{
  this.addedProducts.forEach((element)=>{
    if(element.product_id && 
       element.quantity && 
       element.price){
        this.valiedproducts.push(
          {
          'product_id':String(element.product_id),
          'quantity':Number(element.quantity),
          'price':Number(element.price),
          'discount':Number(element.discount),
          'tax':Number(element.tax),
          'discount_type':Number(element.discount_type),
          'discount_value':Number(element.discount_value),
          }
        )
    }
  })
 }
  return true
}
resetCode(){
  this.addPriceOfferForm.controls['tax_exemption_code'].patchValue(null);
}
newUuid:any
  addPriceOffer(){
   let validProducts= this.checkValidProducts()
   if(validProducts==true){
     this.addPriceOfferForm.controls['products'].setValue(this.valiedproducts)
     this.addPriceOfferForm.controls['total'].setValue(this.total)
     if(this.addPriceOfferForm.valid && this.addPriceOfferForm.dirty){
      //  let formattedDate = datePipe.transform(this.addPriceOfferForm.controls['date'].value, 'yyyy-MM-dd');
      //  this.addPriceOfferForm.controls['date'].setValue(formattedDate)
      
       this.addPriceOfferForm.controls['date'].setValue(this.changeLanguage.getSaudiDate(this.addPriceOfferForm.controls['date'].value));
       this.addPriceOfferForm.controls['due_date'].setValue(this.changeLanguage.getSaudiDate(this.addPriceOfferForm.controls['due_date'].value));

      //  const hasNullTax = this.addedProducts.some(product => (product.tax === null || product.tax === 0));
      //  if(!hasNullTax) this.resetCode();

       this.subs.add(this.http.postReq('api/dashboard/quotations',this.addPriceOfferForm.value).subscribe({
         next:res=>{
         this.newUuid=res.data.uuid
         },complete:()=>{ 
           if(this.companyLogo){
               this.subs.add(this.http.postReq('api/dashboard/settings/upload',this.formDataPayLoad).subscribe({
                 next:res=>{
                  // console.log(res)
                 }
              }))
           }
           if(this.language=='en'){
             this.toastr.info("price offer added successfully")
           }
           else{
            this.toastr.info("تمت إضافة عرض السعر بنجاح")
           }
          //  this.addPriceOfferForm.reset()
          //  this.addedProducts=[{
          //    "product_id":null,
          //      "quantity":0,
          //      "price":0,
          //      "discount":0,
          //      "tax":0,
          //      "total":0,
          //      "totalwithoutTax":0
          //  }]
           this.router.navigate(['/user/prices/price-list/'])
         }
       }))
     }
     else{
       this.addPriceOfferForm.markAllAsTouched();
        // this.changeLanguage.scrollToTop();
        this.changeLanguage.scrollToInvalidInput(this.addPriceOfferForm);
       if(this.language=='en'){
        this.toastr.error('Please Enter All Product Required Values First')
      }
      else{
        this.toastr.error('الرجاء إدخال جميع القيم المطلوبة للمنتجات أولاً')
      }
     }

   }
   else{
    this.addPriceOfferForm.markAllAsTouched();
    //  this.changeLanguage.scrollToTop();
    // this.changeLanguage.scrollFunc('priceProduct');
     this.changeLanguage.scrollToInvalidInput(this.addPriceOfferForm);
    if(this.language=='en'){
      this.toastr.error('Please Enter All Product Required Values First')
    }
    else{
      this.toastr.error('الرجاء إدخال جميع القيم المطلوبة للمنتجات أولاً')
    }
   }
  }
  user:any=this.authService.getUserObj()
  removeMedia(type:string){
    let body={
      collection_name:type
    }
    this.subs.add(this.http.postReq('api/dashboard/settings/clearMediaCollection',body).subscribe({
    next:res=>{

    },complete:()=>{
      this.companyLogo=''
      this.user.media.logo=this.companyLogo
      localStorage.setItem('UserObj',JSON.stringify(this.user))
      if(this.language=='en'){
        this.toastr.info('Data Updated successfully')
      }
      else{
        this.toastr.info('تم تحديث البيانات بنجاح.')
      }
    }
    }))
  }

} 
