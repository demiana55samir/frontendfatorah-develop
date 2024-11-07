
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { client } from '@models/client';
import { addedProduct, product } from '@models/product';
import { subscriptionData } from '@models/userSubscriptioData';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { SubscriptionDataService } from '@services/subscription-data.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-invoices',
  templateUrl: './add-invoices.component.html',
  styleUrls: ['./add-invoices.component.scss']
})
export class AddInvoicesComponent implements OnInit {
  private subs = new Subscription();
  formDataPayLoad = new FormData();
  companyLogo: any = ''
  items=[{label:"عربي"},{label:"انجليزي"}]
  options=[{name:'item1'},{name:'item1'},{name:'item1'}]
  addInvoiceForm!:FormGroup
  selectedTypes = 1;
  clients!:client[]
  totaWithoutTax=0
  productTotal=0
  invoice_type=1
  // tax=[{name:'05%',value:5},{name:'10%',value:10},{name:'15%',value:15},{name:'معفاة',value:null}]
  tax=[{name:'05%',value:5},{name:'15%',value:15},{name:'معفاة',value:null}]

  totalWithTax:any='0.00'
  totaltax:any='0.00'
  total:any='0.00'
  valiedproducts :addedProduct[] = []
  notes={
    ar:'',
    en:''
  }
  addedProducts=[
     {
        product_id:null,
        quantity:1,
        price:0,
        discount:0,
        tax:15,
        total:0,
        totalwithoutTax:0,
        discount_type : 1,
        discount_value :0
    }
  ]
  currentCompanyLogo:string | ArrayBuffer | null=''

  products!:product[]
  invoices_types=[
    {
      id:1,
      img:'./assets/images/invoices/Tax_invoice.svg',
      name_ar:'فاتورة ضريبية',
      name_en:'With Tax',
    },
    {
      id:0,
      img:'./assets/images/invoices/Non-tax_invoice.svg',
      name_ar:'فاتورة غير ضريبية',
      name_en:'Without Tax',
    },
]
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

extraDiscount:number = 0;

taxCodes = [
  {code: 'VATEX-SA-34-1',
    name:'ZERORATEDGOODS.ITEM1'
  },
  {code : 'VATEX-SA-34-2',
    name:'ZERORATEDGOODS.ITEM2'
  }, 
  {code : 'VATEX-SA-34-3',
    name:'ZERORATEDGOODS.ITEM3'
  }, 
  {code : 'VATEX-SA-34-4',
    name:'ZERORATEDGOODS.ITEM4'
  }, 
  {code : 'VATEX-SA-34-5',
    name:'ZERORATEDGOODS.ITEM5'
  }, 
  {code : 'VATEX-SA-35',
    name:'ZERORATEDGOODS.ITEM6'
  },   
  {code : 'VATEX-SA-36',
    name:'ZERORATEDGOODS.ITEM7'
  },   
  {code : 'VATEX-SA-EDU',
    name:'ZERORATEDGOODS.ITEM8'
  },  
  {code : 'VATEX-SA-HEA',
    name:'ZERORATEDGOODS.ITEM9'
  },  
  {code : 'VATEX-SA-MLTRY',
    name:'ZERORATEDGOODS.ITEM10'
  },
  {code : 'VATEX-SA-32',
    name:'ZERORATEDGOODS.ITEM11'
  },   
  {code : 'VATEX-SA-33',
    name:'ZERORATEDGOODS.ITEM12'
  },   
  {code: 'VATEX-SA-29',
    name:'ZERORATEDGOODS.ITEM13'
  },
  {code : 'VATEX-SA-29-7',
    name:'ZERORATEDGOODS.ITEM14'
  },
  {code : 'VATEX-SA-30  ',
    name:'ZERORATEDGOODS.ITEM15'
  }
]


zeroTaxBoolean:boolean = false;
  constructor(private router:Router,private languageChange:ChangeLanguageService,
    private http:HttpService, private route:ActivatedRoute, private userSubscription:SubscriptionDataService,
    private fb:FormBuilder,private toastr:ToastrService,private auth:AuthService) { }
@HostListener('document:keydown', ['$event'])
handleKeyDown(event: KeyboardEvent) {
  if(event.key === 'Enter'){
    event.preventDefault();
  }
}
language:any
subscriptioData:subscriptionData={} as subscriptionData

TodayDate!:Date;
issueDate!:Date;
  ngOnInit() {
    
    this.getInvoiceNumber()
    this.userSubscription.GetUserSubscriptionData().subscribe({
      next:res=>{
         this.subscriptioData=res.data
      },complete:()=> {
        if(this.subscriptioData.invoices==0){
          if(this.language=='ar'){
            this.toastr.error('لقد تخطيت عدد الفواتير المتاحه لك')
        }
        else{
            this.toastr.error('You have exceeded the number of invoices available to you')
        }
          window.history.back();
          // window.location.reload()
        }
      },
    })

    this.language=this.languageChange.local_lenguage

    if(this.language == 'en') {
      this.tax = this.tax.map(item => {
        if (item.name === 'معفاة') {
          return {...item, name: 'Exempt'};
        }
        return item;
      });
    }
    
    this.selectedTypes=this.auth.getUser().is_taxable
    
    if(this.selectedTypes == 0){
      this.addedProducts.forEach(product=>{
        product.tax = 0;
      })
    }
    this.getAllClients()
    this. getAllProducts()
    this.addInvoiceForm=this.fb.group({
      number:['',Validators.required],
      client_id:[null,Validators.required],
      date:['',Validators.required],
      temp_date:['',Validators.required],
      invoice_due:['',Validators.required],
      products:[''],
      total:[-1,Validators.required],
      notes:this.fb.group({
        ar: [''],
        en: [''] 
      }),
      discount:[''],
      tax_exemption_code:['']
    })
    this.getProfileData();
    this.getRouteParam()

    this.TodayDate = new Date();
    this.TodayDate = new Date(this.languageChange.getSaudiDate(this.TodayDate))
    // this.addInvoiceForm.controls['date'].setValue(this.TodayDate);
    this.addInvoiceForm.controls['temp_date'].setValue(this.TodayDate);
    this.addInvoiceForm.controls['invoice_due'].setValue(this.TodayDate);
    this.issueDate = this.TodayDate
  }

  isDateBeforeOrEqual(date1: Date, date2: Date): boolean {
    return date1.getTime() < date2.getTime();
}


submitBool = false;
  changeIssueDate(){
    
    // alert(this.isDateBeforeOrEqual(this.issueDate , this.addInvoiceForm.controls['invoice_due'].value))
    if( this.addInvoiceForm.controls['invoice_due'].value && !this.submitBool  && !this.isDateBeforeOrEqual(this.issueDate , this.addInvoiceForm.controls['invoice_due'].value)){
      // this.addInvoiceForm.controls['date'].setValue(this.issueDate);
      
      // this.addInvoiceForm.controls['invoice_due'].setValue(this.addInvoiceForm.controls['date'].value);
      this.addInvoiceForm.controls['invoice_due'].setValue(this.addInvoiceForm.controls['temp_date'].value);
    }
    // if(this.issueDate){
    //   this.formatDateToRiyadh(this.issueDate)
    // }
    
  }
 
  getInvoiceNumber(){
    this.subs.add(this.http.getReq('api/dashboard/invoices/create').subscribe({
      next:res=>{
          let invoice_Number = res.data.invoice_number;
          this.addInvoiceForm.controls['number'].setValue(invoice_Number);
      }
    }))
  }

  getQuotations(quotationsUuid:number){
    this.totalWithTax = 0;
    this.totaltax = 0;
    let url=`api/dashboard/quotations/${quotationsUuid}`
   
    this.subs.add(this.http.getReq(url).subscribe({
     next:res=>{
      this.addInvoiceForm.controls['client_id'].patchValue(res.data.client_uuid)
      this.addedProducts = res.data.products
      this.addedProducts = res.data.products.map((product:any) => {
        this.totalWithTax += (product.pivot.price * product.pivot.quantity) - product.pivot.discount;
        this.totaltax +=  (product.pivot.tax/100) * (product.pivot.price * product.pivot.quantity - product.pivot.discount);
        return{
          product_id:product.uuid,
          quantity: Number(product.pivot.quantity),
          discount_type:Number(product.pivot.discount_type),
          discount_value:Number(product.pivot.discount_value),
          discount:Number(product.pivot.discount),
          price:Number(product.pivot.price),
          tax:Number(product.pivot.tax) > 0 ? Number(product.pivot.tax) : null,
          total:product.pivot.total,
          totalwithoutTax: (product.pivot.quantity * product.pivot.price) - Number(product.pivot.discount)
        }
      
      });
      this.total = res.data.total;
      this.addInvoiceForm.controls['notes'].patchValue(res.data.notes);
      const hasNullTax = this.addedProducts.some(product => (product.tax === null || product.tax === 0));

      if (hasNullTax) {
        this.zeroTaxBoolean = true;
        if(!this.addInvoiceForm.controls['tax_exemption_code'].value){
          this.addInvoiceForm.controls['tax_exemption_code'].setValue(this.taxCodes[0].code);
        }
      } else {
        this.zeroTaxBoolean = false;
      }
     }
    }))
  
   

  }
 
  getRouteParam(){
    this.route.queryParams.subscribe(params => {
   
      if(params['quotation']){
        this.getQuotations(params['quotation'])
      }
      if(params['client']){
        this.addInvoiceForm.controls['client_id'].patchValue(params['client'])
      }
      // let param2 = params['param2']; // get the value of param2
    });
  }
  
  getAllClients(){
    // this.subs.add(this.http.getReq('api/dashboard/clients').subscribe({
      this.subs.add(this.http.getReq('api/dashboard/ajax/clients/search').subscribe({ 
      next:res=>{
        this.clients=res.data
      },complete:()=>{
        // if (this.route.snapshot.paramMap.has('uuid')) {
        //   let clientUuid = this.route.snapshot.paramMap.get('uuid')
        //   this.addInvoiceForm.controls['client_id'].patchValue(clientUuid)
        // }
      
       
      }
    }))
  }

  resetCode(){
    this.addInvoiceForm.controls['tax_exemption_code'].patchValue(null);
  }
  setCardData(){
      this.totaltax=0
        this.totalWithTax=0
        this.total=0
   
    this.addedProducts.forEach((element)=>{

      // this.totaltax=this.totaltax+element.tax
      if(element.tax){
        this.totaltax= ((this.totaltax+((element?.tax/100)*((Number(element?.price)*Number(element?.quantity))-Number(element?.discount)))))
      }
      this.totalWithTax=(this.totalWithTax+element?.totalwithoutTax)
      // this.total=this.total+element?.total
    }) 
    const hasNullTax = this.addedProducts.some(product => (product.tax === null || product.tax === 0));

    if (hasNullTax) {
      this.zeroTaxBoolean = true;
      if(!this.addInvoiceForm.controls['tax_exemption_code'].value){
        this.addInvoiceForm.controls['tax_exemption_code'].setValue(this.taxCodes[0].code);
      }
    } else {
      this.zeroTaxBoolean = false;
    }

      // if there is an extra discount
      if(this.extraDiscount <= this.totalWithTax){
        this.totalWithTax -= this.extraDiscount;
      }else{
        this.extraDiscount = 0;
        this.setCardData();
        if(this.language=='en'){
          this.toastr.error('The extra discount Value Is Invalid')
        }
        else{
          this.toastr.error('قيمة الخصم الاضافى غير صحيحة')
        }
      }
      this.total=this.totalWithTax + this.totaltax
  }



  getAllProducts(){
    // this.subs.add(this.http.getReq('api/dashboard/products').subscribe({
    this.subs.add(this.http.getReq('api/dashboard/ajax/products/search').subscribe({
      next:res=>{
        this.products=res.data
      }
    }))
  }
  setPrice(index:number,product_id:any){
  const Product_index=  this.products.findIndex((c:any)=>c.uuid==product_id)
    if(Product_index>-1){
       this.addedProducts[index].price=this.products[Product_index].price
    }
  }
   addInvoice(){

    this.submitBool = true;
    let validProducts= this.checkValidProducts();

    if(validProducts){
      // console.log('before' , this.addInvoiceForm.controls['invoice_due'].value);
      
      let temp_date = this.languageChange.getSaudiDate(this.issueDate)
      this.addInvoiceForm.controls['date'].setValue(temp_date);

      let temp_invoice_due = this.languageChange.getSaudiDate(this.addInvoiceForm.controls['invoice_due'].value)
      this.addInvoiceForm.controls['invoice_due'].setValue(temp_invoice_due);

      // console.log('after' , this.addInvoiceForm.controls['invoice_due'].value);

      this.addInvoiceForm.controls['products'].setValue(this.valiedproducts)
      this.addInvoiceForm.controls['total'].setValue(this.total.toFixed(2))
      if(this.addInvoiceForm.valid){

        const notesArValue = this.addInvoiceForm.get('notes.ar')?.value;
      this.addInvoiceForm.get('notes')?.patchValue({
        ar:  notesArValue,
        en:  notesArValue
      });

      // if(this.addInvoiceForm.controls['notes'].value){
      //   this.notes.ar=this.addInvoiceForm.controls['notes'].value
      //   this.notes.en=this.addInvoiceForm.controls['notes'].value
      //   this.addInvoiceForm.controls['notes'].setValue(this.notes)
      // }

      const hasNullTax = this.addedProducts.some(product => (product.tax === null || product.tax === 0));
      if(!hasNullTax) this.resetCode();
     
      console.log(this.addInvoiceForm.value);
    
        this.subs.add(this.http.postReq('api/dashboard/invoices',this.addInvoiceForm.value).subscribe({
          next:res=>{
            // console.log(res)
          },complete:()=>{
            let user=this.auth.getUserObj()
            user.remaining_invoices=user.remaining_invoices-1
            localStorage.setItem('UserObj',JSON.stringify(user))


            if(this.language=='en'){
              this.toastr.info("invoice added successfully")
            }
            else{
              this.toastr.info("تمت إضافة الفاتورة بنجاح")
            }
            // this.addInvoiceForm.reset()
            // this.addedProducts=[{
            //   "product_id":null,
            //     "quantity":0,
            //     "price":0,
            //     "discount":0,
            //     "tax":0,
            //     "total":0,
            //     "totalwithoutTax":0
            // }]
            // this.total=0
            // this.totalWithTax=0
            // this.totaltax=0
            this.router.navigate(['/user/invoices/All-invoices'])
          },error:()=>{
            // this.addInvoiceForm.controls['notes'].setValue(this.notes.ar)
            // this.valiedproducts =[];
            // this.addedProducts=[{
            //   "product_id":null,
            //     "quantity":0,
            //     "price":0,
            //     "discount":0,
            //     "tax":0,
            //     "total":0,
            //     "totalwithoutTax":0
            // }]
            // this.total = 0;
            // this.addInvoiceForm.reset();
          }
        }))
      }
      else{
        this.addInvoiceForm.markAllAsTouched()
        // this.languageChange.scrollToTop();
        this.languageChange.scrollToInvalidInput(this.addInvoiceForm);
        if(this.language=='en'){
          this.toastr.error('please Enter All Product Required Values First')
        }
        else{
          this.toastr.error('الرجاء إدخال جميع القيم المطلوبة للمنتجات أولاً')
        }
      }

    }
    else{
      this.addInvoiceForm.markAllAsTouched()
        // this.languageChange.scrollToTop();
        this.languageChange.scrollFunc('productList');
        // this.languageChange.scrollToInvalidInput(this.addInvoiceForm);
      if(this.language=='en'){
        this.toastr.error('please Enter All Product Required Values First')
      }
      else{
        this.toastr.error('الرجاء إدخال جميع القيم المطلوبة للمنتجات أولاً')
      }
     }
 
   }
   validateImage(event:any) {
    this.formDataPayLoad.delete('image')
    let reader = new FileReader();
    const file:File = event.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
        // When file uploads set it to file formcontrol
        reader.onload = () => {
          this.currentCompanyLogo = reader.result;
        }
  
        this.formDataPayLoad.append("logo", file);
        this.subs.add(this.http.postReq('api/dashboard/settings/upload',this.formDataPayLoad).subscribe({
          next:res=>{
          //  console.log(res)
          }
       }))
    }
  }
  increaseDevice() {
    length=this.addedProducts.length
    console.log(this.addedProducts[this.addedProducts.length-1].product_id && this.addedProducts[this.addedProducts.length-1].price && this.addedProducts[this.addedProducts.length-1].quantity);
    
    if(this.addedProducts[this.addedProducts.length-1].product_id && this.addedProducts[this.addedProducts.length-1].price && this.addedProducts[this.addedProducts.length-1].quantity){
      let newProduct = {
        "product_id":null,
          "quantity":1,
          "price":0,
          "discount":0,
          "tax":15,
          "total":0,
          "totalwithoutTax":0,
          discount_type:1,
          discount_value:0
      }
      if(this.selectedTypes == 0){
        newProduct.tax = 0;
      }
      this.addedProducts.push(newProduct);
  
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

  // getTotal(index:number){
  //   this.getTotalWithoutTax(index)
  //   if(this.addedProducts[index].tax==null){
  //     this.addedProducts[index].total=Number((this.addedProducts[index].totalwithoutTax).toFixed(2))
  //   }
  //   else{
  //     this.addedProducts[index].total=Number((((this.addedProducts[index].tax/100)*this.addedProducts[index].totalwithoutTax)+this.addedProducts[index].totalwithoutTax).toFixed(2))
  //   }

  // }
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
  getTotalWithoutTax(index:number){

    // discount type feature
    this.addedProducts[index].discount_value = Number(this.addedProducts[index].discount_value);
    this.checkValidValue(index)
  
    
    if(this.addedProducts[index].quantity && this.addedProducts[index].price &&
       this.addedProducts[index].discount_type && this.addedProducts[index].discount_value){
      
         // ------------------- discount type feature --------------------------
      if(this.addedProducts[index].discount_type == 1){
        this.addedProducts[index].discount = (Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price)) * (this.addedProducts[index].discount_value/100)
      }else{
        this.addedProducts[index].discount =  this.addedProducts[index].discount_value;
      }
      // ------------------------------------------------------------------------
      if( Number(this.addedProducts[index].discount ) < (Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price))){
        this.addedProducts[index].totalwithoutTax=Number(((Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price))).toFixed(2))

       
        this.addedProducts[index].totalwithoutTax=Number((this.addedProducts[index].totalwithoutTax-Number(this.addedProducts[index].discount)).toFixed(2))
        this.addedProducts[index].total=Number((this.addedProducts[index].totalwithoutTax).toFixed(2))
      } 
      else{
         // discount type feature
        this.addedProducts[index].discount=0
        this.addedProducts[index].discount_value=0
        // --------------------------------------------
        if(this.language=='en'){
          this.toastr.error('The Discount Value Is Invalid')
        }
        else{
          this.toastr.error('قيمة الخصم غير صحيحة')
        }
        this.addedProducts[index].totalwithoutTax=Number(((Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price))).toFixed(2))

      }
   }
     else if(this.addedProducts[index].quantity && this.addedProducts[index].price){

      this.addedProducts[index].totalwithoutTax=Number(((this.addedProducts[index].quantity)*Number(this.addedProducts[index].price)).toFixed(2))
     this.addedProducts[index].total=Number((this.addedProducts[index].totalwithoutTax).toFixed(2))
    }
    if(this.addedProducts[index].tax==null){
      this.addedProducts[index].total=Number((this.addedProducts[index].totalwithoutTax).toFixed(2))
    }
    else{
      this.addedProducts[index].total=Number((((this.addedProducts[index].tax/100)*this.addedProducts[index].totalwithoutTax)+this.addedProducts[index].totalwithoutTax).toFixed(2))
    }
  }


  // todo handle
  deleteRowDevice(index: number) {
    this.addedProducts.splice(index, 1);
  //  console.log(this.addedProducts.length) 
   this.totaltax=0
   this.totalWithTax=0
   this.total=0
    this.addedProducts.forEach((element)=>{
      if(element.tax){
        this.totaltax=Number((this.totaltax+((element.tax/100)*((Number(element.price)*Number(element.quantity))-Number(element.discount)))).toFixed(2))
      }
      this.totalWithTax=Number((this.totalWithTax+element.totalwithoutTax).toFixed(2))
      this.total=Number((this.total+element.total).toFixed(2))
    })

    const hasNullTax = this.addedProducts.some(product => (product.tax === null || product.tax === 0));

    if (hasNullTax) {
      this.zeroTaxBoolean = true;
      if(!this.addInvoiceForm.controls['tax_exemption_code'].value){
        this.addInvoiceForm.controls['tax_exemption_code'].setValue(this.taxCodes[0].code);
      }
    } else {
      this.zeroTaxBoolean = false;
    }
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

checkValidAddedProduct(index:number){
  if(!this.addedProducts[index].product_id || !this.addedProducts[index].quantity || !this.addedProducts[index].price){
    return false;
  }
   return true
}
checkValidAddedProducts(){
  this.length=this.addedProducts.length;
  if(!this.addedProducts[this.length-1].product_id || !this.addedProducts[this.length-1].quantity || !this.addedProducts[this.length-1].price){
    return false;
  }
   return true
}
ISValidAddedProducts(){
  for (let i = 0; i < this.addedProducts.length; i++) {
    const product = this.addedProducts[i];
    if (!product.product_id || !product.quantity || !product.price) {
      return false; // Early exit if any product is invalid
    }
  }
  return true; // All products are valid
 
}

checkValidProducts(){
  // this.addedProducts.pop()
  this.valiedproducts = [];
 this.removeEmptyProduct()
 this.length=this.addedProducts.length
 if(!this.addedProducts[this.length-1].product_id || !this.addedProducts[this.length-1].quantity || !this.addedProducts[this.length-1].price){
   return false;
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
          'discount_type': element.discount_type,
          'discount_value': element.discount_value,

          }
        )
    }
  })
 }
  return true
}
  user:client={} as client
  profileData:any
  getProfileData(){
    this.subs.add(this.http.getReq('api/dashboard/account/profile').subscribe({
      next:res=>{
       this.currentCompanyLogo=res.data.media.logo
       this.profileData=res.data
      }
    }))
  }

  @ViewChild('invoiceNumber') invoiceNumber!: ElementRef;
  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent): void {
    if (document.activeElement === this.invoiceNumber.nativeElement) {
      event.preventDefault(); // Prevent the default Enter key behavior
    }
  }
   ngOnDestroy() {
    this.subs.unsubscribe();
  }


  convertNumber(numberString:any){
    return Number(numberString);
  }
  
 
}
