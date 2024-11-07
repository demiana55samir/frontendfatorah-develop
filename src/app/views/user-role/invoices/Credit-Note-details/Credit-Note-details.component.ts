import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { creditNotes } from '@models/credit-notes';
import { addedProduct, product ,addedProductWithTotal} from '@models/product';
import { userInvoice } from '@models/user-invoices';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';

import { ToastrService } from 'ngx-toastr';
import { Subscription, debounceTime } from 'rxjs';
import {Location} from '@angular/common';
import { AuthService } from '@services/auth.service';
import { Download_pdfService } from '@services/download_pdf.service';
@Component({
  selector: 'app-Credit-Note-details',
  templateUrl: './Credit-Note-details.component.html',
  styleUrls: ['./Credit-Note-details.component.scss']
})
export class CreditNoteDetailsComponent implements OnInit {

  downloadBoo = false;
  addedProducts:any=[
    {
      "product_id":null,
        "quantity":0,
        "max_qty":0,
        "maxQuantity":0,
        "price":0,
        "discount":0,
        "tax":0,
        "total":0,
        "totalwithoutTax":0,
        "uuid":null,
        "discount_type" : 1,
        "discount_value" :0
    }
  ]
  products!:product[]
  invoiceProducts=[
    {
      "product_id":null,
        "quantity":0,
        "max_qty":0,
        "price":0,
        "discount":null,
        "tax":0,
        "total":0,
        "totalwithoutTax":0,
        "uuid":null,
        "discount_type" : 1,
        "discount_value" :0
    }
  ]
  // tax=[{name:'05%',value:5},{name:'10%',value:10},{name:'15%',value:15},{name:'معفاة',value:null}]
  tax=[{name:'05%',value:5},{name:'15%',value:15},{name:'معفاة',value:0}]
  totalWithTax=0
  totaltax=0
  total=0
  OrignalTotal=0;
  valiedproducts :addedProduct[] = []
  created_at!:Date
  invoice_due!:Date
  invoice:userInvoice={} as userInvoice

  creditNumber:any = 0
  
  myAngularxQrCode: string = '';

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
  constructor(private activeRoute:ActivatedRoute,
    private http:HttpService,
    private router:Router,
    private fb:FormBuilder,
    private toastr:ToastrService,
    private changelang:ChangeLanguageService,
    private _location: Location,private auth:AuthService,
    private download_pdfService:Download_pdfService,
    private changeLang:ChangeLanguageService,
    private location: Location
    ) { }
  uuid:string = '';
  addDebtNoticeForm!:FormGroup
language:any
  creditNotes:creditNotes = {} as creditNotes;
  Allinvoices:userInvoice[] = []
  note=''
  type:string=''
  disableData=false
  private subs=new Subscription()
  invoiceColor=''

  TodayDate!:Date;
  issueDate!:Date;
  selectedTypes = 1;

  invoiceDate!:Date;

  showWarning :boolean = false;
  showErrors :boolean = false;

  private routerSub!: Subscription;
  private locationSub: any;
  ngOnInit() {
    this.TodayDate = new Date();
    this.TodayDate = new Date(this.changelang.getSaudiDate(this.TodayDate))
    
    
    
     // Listen to router events
     this.locationSub = this.location.subscribe((res) => {
      console.log(res);
      if(!res.url?.includes('create/-1')){
        this.closeModalClick();
      }
    });
    
    this.language=this.changelang.local_lenguage 
    if(this.language == 'en') {
      this.tax = this.tax.map(item => {
        if (item.name === 'معفاة') {
          return {...item, name: 'Exempt'};
        }
        return item;
      });
    }
    
    this.selectedTypes=this.auth.getUser().is_taxable

    this.invoiceColor=String(localStorage.getItem('invoiceColor'))

    
    this.addDebtNoticeForm=this.fb.group({
      number:['',Validators.required],
      invoice_id:['',Validators.required],
      date:['',Validators.required],
      temp_date:['',Validators.required],
      due_date:['',Validators.required],
      products:[null , Validators.required],
      total:['',Validators.required],
      notes:['',Validators.required],
      tax_exemption_code:['']
    })
    
    // this.getAllProducts();
    this.uuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
    this.type= String(this.activeRoute.snapshot.paramMap.get('type'))


    if(this.type=='create'){
      // this.addDebtNoticeForm.controls['date'].setValue(this.TodayDate);
      this.addDebtNoticeForm.controls['temp_date'].setValue(this.TodayDate);
      this.created_at = this.TodayDate;
      this.issueDate = this.TodayDate;
      if(this.uuid != '-1'){
        // this.getAllProducts();
        // this.getInvoiceDetails(this.uuid);

        this.getCreditNumber(this.uuid)  

      }else{
        this.getAllProducts()
        setTimeout(()=>{
          this.getAllInvoices()
        },200)
      }

    }
    else{
      this.addDebtNoticeForm.get('notes')?.disable();
      this.getAllProducts()
      setTimeout(()=>{
        this.getCreditNotesDetails(this.uuid);
      },200)
    }

  
    
    
  }



  ngOnDestroy(): void {
    // Clean up the subscription when the component is destroyed
    if (this.locationSub) {
      this.locationSub.unsubscribe();
    }
  }

  changeIssueDate(){
    if(this.type=='create'){
      this.invoice_due =  this.created_at;
      this.addDebtNoticeForm.controls['due_date'].setValue(this.addDebtNoticeForm.controls['temp_date'].value);

    }
  }

  ResetProducts(){
    this.totalWithTax = 0;
    this.totaltax = 0;

    this.addedProducts = this.products
  .filter((product: any) => product.max_qty > 0)  
  .map((product:any) => {
    this.totalWithTax += (product.price * product.max_qty) - product.discount;
    this.totaltax +=  (product.tax/100) * (product.price * product.max_qty - product.discount);
    return{
      product_id:product.uuid,
      quantity:product.quantity,
      max_qty:product.max_qty,
      maxQuantity:product.max_qty,
      price:product.price,
      discount_type:product.discount_type,
      discount_value:product.discount_value,
      discount:product.discount,
      tax:product.tax,
      total:product.total,
      totalwithoutTax: product.taxable_amount
    }
  });
    this.total = this.OrignalTotal;
  }
  getInvoiceDetails(uuid:string){
  this.subs.add(this.http.getReq(`api/dashboard/invoices/${String(uuid)}`).subscribe({
    next:res=>{
  this.invoice=res.data

  this.invoiceDate = res.data.date;
  this.invoiceDate = new Date(this.changeLang.getSaudiDate(res.data.date))


  this.addedProducts = res.data.products;
   // todo -> zeroTax
  // const hasNullTax = this.addedProducts.some((product: { tax: number | null; }) => (product.tax === null || product.tax === 0));
  // if(hasNullTax) {
  //   this.zeroTaxBoolean = true;
  //   this.addDebtNoticeForm.controls['tax_exemption_code'].setValue(this.taxCodes[0].code);
  // }

  this.addedProducts = res.data.products
  .filter((product: any) => product.max_qty > 0)  
  .map((product:any) => {
    // this.totalWithTax += (product.price * product.quantity) - product.discount;
    // this.totaltax +=  (product.tax/100) * (product.price * product.quantity - product.discount);
    this.totalWithTax += (product.price * product.max_qty) - product.discount;
    this.totaltax +=  (product.tax/100) * (product.price * product.max_qty - product.discount);

    let tempTotalwithoutTax = (product.discount_type == 1)? (product.max_qty * product.price) - (product.max_qty * product.price * (product.discount_value/100)) : (product.max_qty * product.price - product.discount_value)
    let tempTotal = tempTotalwithoutTax + tempTotalwithoutTax *( product.tax/100)
    return{
      product_id:product.uuid,
      quantity:product.quantity,
      max_qty:product.max_qty,
      maxQuantity:product.max_qty,
      price:product.price,
      discount_type:product.discount_type,
      discount_value:product.discount_value,
      discount:product.discount,
      tax:product.tax,
      total:tempTotal,
      totalwithoutTax: tempTotalwithoutTax
    }
  });
    this.total = res.data.total;
    this.OrignalTotal = res.data.total;
    if(this.type =='create') {
      this.products = res.data.products;

    }

    },complete:()=>{
      if(this.addedProducts.length == 0){
        if(this.language=='en'){
          this.toastr.warning('Cannot create a credit note because the invoice has been fully returned or is more than 15 days old.')
        }
        else{
          this.toastr.warning('لا يمكن اضافة اشعار دائن لأنه تم ارجاع الفاتورة بالكامل او الفاتورة قد مضى عليها اكثر من 15 يوما ')
        }
        this.router.navigate(['/user/invoices/All-credit-notes']);
      }

       this.getCreditNumber(this.uuid)  
    }
  }))
  }
  getCreditNotesDetails(uuid:string){
      this.subs.add(this.http.getReq(`api/dashboard/credit_notes/${uuid}`).subscribe({
        next:res=>{
          this.creditNotes=res.data

          this.myAngularxQrCode =  res.data?.qr_code;
          // this.creditNumber=String(res.data.credit_note_number)
        this.creditNumber=res.data.number

        this.myAngularxQrCode =  res.data?.qr_code;
        // this.myAngularxQrCode = 'AQ5mYXRvcmFocHJvdGVzdAIPMTIzNDU2Nzg5MTIzNDU2AxMyMDI0LTAyLTI5IDA3OjE5OjIzBAQ2MDAwBQEw';
  
        this.addDebtNoticeForm.controls['notes'].setValue(res.data?.notes);

         this.invoice.number=res.data.invoice_number
         this.invoice.client=res.data.client

         this.invoice.user_fax = res?.data?.user_fax
         this.invoice.address = res?.data?.address
         this.invoice.telephone = res?.data?.telephone
         this.invoice.tax_number = res?.data?.tax_number

         if(this.creditNotes.issue_date){
           this.created_at= new Date(this.creditNotes.issue_date);
         }
         if(res.data.due_date){
           this.invoice_due=new Date(res.data.due_date);
         }
          // this.invoice=res.data.invoice
          this.note=res.data.notes
          if(res.data.products){
             // todo -> zeroTax
            // const hasNullTax = res.data.products.some((product: { tax: number | null; }) => (product.tax === null || product.tax === 0));
            // if(hasNullTax) {
            //   this.zeroTaxBoolean = true;
            //   this.addDebtNoticeForm.controls['tax_exemption_code'].setValue(this.taxCodes[0].code);
            // }

            this.addedProducts.pop()

            this.invoiceProducts=res.data.products
            this.addedProducts = res.data.products
          
            this.addedProducts = res.data.products
            this.addedProducts = res.data.products.map((product:any) => {
              // this.totalWithTax += (product.price * product.quantity) - product.discount;
              // this.totaltax +=  (product.tax/100) * (product.price * product.quantity - product.discount);
              this.totalWithTax += (product.price * product.max_qty) - product.discount;
              this.totaltax +=  (product.tax/100) * (product.price * product.max_qty - product.discount);
              return{
                product_id:product.uuid,
                quantity:product.quantity,
                max_qty:product.max_qty,
                maxQuantity:product.max_qty,
                price:product.price,
                discount:product.discount,
                discount_type:product.discount_type,
                discount_value:product.discount_value,
                tax:product.tax,
                total:product.total,
                totalwithoutTax: product.taxable_amount
                
              }
            
            });
            this.total = res.data.total;
            if(this.type =='create') {
              this.products = res.data.products;
            }
        
            // this.invoiceProducts.forEach((element,index)=>{
            //   let totalwithoutTax=(Number(element.quantity)*Number(element.price))-Number(element.discount)
            //   this.addedProducts.push(
            //     {
            //       "product_id":element.product_id,
            //       "discount":0,
            //       "price":element.price,
            //       "quantity":element.quantity,
            //       "tax":element.tax,
            //       "total":element.total,
            //       "totalwithoutTax":totalwithoutTax,
            //       "uuid":element.uuid
            //     }
            //   )
            // })
            
            // this.setCardData()
          }
        },
        complete:()=>{
          // this.getAllProducts();
          // this.getCreditNumber()
          setTimeout(() => {
            this.disableData=true
          }, 300);
 
        }
      }))
    }

    getAllInvoices(){
      // todo change api 
      // let getUrl = 'api/dashboard/invoices';
      let getUrl = 'api/dashboard/invoices/inovice-allowed-create-credi-note';
      this.http.getReq(getUrl).subscribe({
        next:res=>{
          this.Allinvoices = res.data;
        },
        complete:()=>{
          this.openModal()
        }
      }); 
   }

   chooseInovice(e:any){
    this.uuid = String(e.value);
    // this.getInvoiceDetails(this.uuid)
   }


   @ViewChild('InvoiceModal') InvoiceModal!: ElementRef<HTMLElement>;
    openModal() {
      console.log('11');
      
        let el: HTMLElement = this.InvoiceModal.nativeElement;
        el.click();
    }

    @ViewChild('closeModal') closeModal!: ElementRef<HTMLElement>;
    closeModalClick() {
        let el: HTMLElement = this.InvoiceModal.nativeElement;
        el.click();
    }
    ChooseInvoiceNumber(){
      if(this.uuid != '-1'){
        // this.getInvoiceDetails(this.uuid)
        this.getCreditNumber(this.uuid)  
        this.closeModalClick()
        this.router.navigateByUrl('/user/invoices/credit-note-details/create/'+this.uuid);
      }
      
    }

    setCardData(){
      this.totaltax=0
      this.totalWithTax=0
      this.total=0
      this.addedProducts.forEach((element:any)=>{
        if(element.tax){
          // this.totaltax= this.totaltax+((element.tax/100)*((Number(element.price)*Number(element.quantity))-Number(element.discount)))
          this.totaltax= this.totaltax+((element.tax/100)*((Number(element.price)*Number(element.max_qty))-Number(element.discount)))
          this.totaltax= Number(this.totaltax.toFixed(2))
        }
        this.totalWithTax=this.totalWithTax+Number(element.totalwithoutTax)
        this.totalWithTax= Number(this.totalWithTax.toFixed(2))
        this.total=this.total+Number(element.total)
        this.total=Number(this.total.toFixed(2))
      }) 

       // todo -> zeroTax
      // const hasNullTax = this.addedProducts.some(product => (product.tax === null || product.tax === 0));
      // if (hasNullTax) {
      //   this.zeroTaxBoolean = true;
      //   if(!this.addDebtNoticeForm.controls['tax_exemption_code'].value){
      //     this.addDebtNoticeForm.controls['tax_exemption_code'].setValue(this.taxCodes[0].code);
      //   }
      // } else {
      //   this.zeroTaxBoolean = false;
      // }

    }
    getAllProducts(){
      // this.subs.add(this.http.getReq('api/dashboard/products').subscribe({
        this.subs.add(this.http.getReq('api/dashboard/ajax/products/search').subscribe({
        next:res=>{
          this.products=res.data
        }
      }))
    }

    getCreditNumber(uuid:string){
      this.subs.add(this.http.getReq('api/dashboard/invoices/'+ uuid +'/credit_notes/create').subscribe({
        next:res=>{
          this.creditNumber=(res.data?.credit_note_number);
          this.addDebtNoticeForm.controls['number'].setValue(Number(this.creditNumber));

          // ------------------------
          this.invoice=res.data.invoice

          this.invoiceDate = res.data.invoice.date;
          this.invoiceDate = new Date(this.changeLang.getSaudiDate(res.data.invoice.date))
        
        
          this.addedProducts = res.data.invoice.products;

          this.addedProducts = res.data.invoice.products
          .filter((product: any) => product.max_qty > 0)  
          .map((product:any) => {
          

            this.totalWithTax += (product.price * product.max_qty) - product.discount;
            this.totaltax +=  (product.tax/100) * (product.price * product.max_qty - product.discount);
        
            let tempTotalwithoutTax = (product.discount_type == 1)? (product.max_qty * product.price) - (product.max_qty * product.price * (product.discount_value/100)) : (product.max_qty * product.price - product.discount_value)
            let tempTotal = tempTotalwithoutTax + tempTotalwithoutTax *( product.tax/100)
            return{
              product_id:product.uuid,
              quantity:product.quantity,
              max_qty:product.max_qty,
              maxQuantity:product.max_qty,
              price:product.price,
              discount_type:product.discount_type,
              discount_value:product.discount_value,
              discount:product.discount,
              tax:product.tax,
              total:tempTotal,
              totalwithoutTax: tempTotalwithoutTax
            }
          });
            this.total = res.data.invoice.total;
            this.OrignalTotal = res.data.invoice.total;

            if(this.type =='create') {
              this.products = res.data.invoice.products;
            }

            if(this.addedProducts.length == 0){
              if(this.language=='en'){
                this.toastr.warning('Cannot create a credit note because the invoice has been fully returned or is more than 15 days old.')
              }
              else{
                this.toastr.warning('لا يمكن اضافة اشعار دائن لأنه تم ارجاع الفاتورة بالكامل او الفاتورة قد مضى عليها اكثر من 15 يوما ')
              }
              this.router.navigate(['/user/invoices/All-credit-notes']);
            }
          // -----------------------
        },
        error: (err)=> {
          this.Back()
        },
      }))
    }
    increaseDevice() {
      length=this.addedProducts.length
      // && this.addedProducts[this.addedProducts.length-1].price
      if(this.addedProducts[this.addedProducts.length-1].product_id && this.addedProducts[this.addedProducts.length-1].max_qty > 0){
        this.addedProducts.push({
          "product_id":null,
            "quantity":0,
            "max_qty":0,
            "maxQuantity":1000000000,
            "price":0,
            "discount":0,
            "tax":0,
            "total":0,
            "totalwithoutTax":0,
            "uuid":null,
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
    // getTotal(index:number){
    //   this.getTotalWithoutTax(index)
    //   if(this.addedProducts[index].tax==null){
    //     this.addedProducts[index].total=this.addedProducts[index].totalwithoutTax
    //   }
    //   else{
    //     this.addedProducts[index].total=((Number(this.addedProducts[index].tax)/100)*Number(this.addedProducts[index].totalwithoutTax))+Number(this.addedProducts[index].totalwithoutTax)
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
        // this.addedProducts[index].quantity=0
        this.addedProducts[index].max_qty=0
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
      // alert(this.addedProducts[index].discount)
// discount type feature
    this.addedProducts[index].discount_value = Number(this.addedProducts[index].discount_value);
      this.checkValidValue(index)
       

      if(this.addedProducts[index].max_qty && this.addedProducts[index].price && 
        this.addedProducts[index].discount_type && this.addedProducts[index].discount_value
        ){

          // ------------------- discount type feature --------------------------
          if(this.addedProducts[index].discount_type == 1){
            // this.addedProducts[index].discount = (Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price)) * (this.addedProducts[index].discount_value/100)
            this.addedProducts[index].discount = (Number(this.addedProducts[index].max_qty)*Number(this.addedProducts[index].price)) * (this.addedProducts[index].discount_value/100)
          }else{
            this.addedProducts[index].discount =  this.addedProducts[index].discount_value;
          }
          // ------------------------------------------------------------------------

        if( Number(this.addedProducts[index].discount ) < (Number(this.addedProducts[index].max_qty)*Number(this.addedProducts[index].price))){
          // this.addedProducts[index].totalwithoutTax=(Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price))
          this.addedProducts[index].totalwithoutTax=(Number(this.addedProducts[index].max_qty)*Number(this.addedProducts[index].price))
          this.addedProducts[index].totalwithoutTax=this.addedProducts[index].totalwithoutTax-Number(this.addedProducts[index].discount)

          this.addedProducts[index].totalwithoutTax = Number(this.addedProducts[index].totalwithoutTax.toFixed(2));

          this.addedProducts[index].total=this.addedProducts[index].totalwithoutTax
          this.addedProducts[index].total=Number( this.addedProducts[index].total.toFixed(2))
        }
        else{
          // this.addedProducts[index].discount=0
          // this.addedProducts[index].discount_value=0
          // if(this.language=='en'){
          //   this.toastr.error('The Discount Value Is Invalid')
          // }
          // else{
          //   this.toastr.error('قيمة الخصم غير صحيحة')
          // }
          // this.addedProducts[index].totalwithoutTax=(Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price))
          this.addedProducts[index].totalwithoutTax=(Number(this.addedProducts[index].max_qty)*Number(this.addedProducts[index].price))
          this.addedProducts[index].totalwithoutTax = Number(this.addedProducts[index].totalwithoutTax.toFixed(2));
        }
     }
       else if(this.addedProducts[index].max_qty && this.addedProducts[index].price){
        //  alert(this.addedProducts[index].quantity + ' ' + this.addedProducts[index].price)
        // this.addedProducts[index].totalwithoutTax=((Number(this.addedProducts[index].quantity)*Number(this.addedProducts[index].price)))
        this.addedProducts[index].totalwithoutTax=((Number(this.addedProducts[index].max_qty)*Number(this.addedProducts[index].price)))

        
        this.addedProducts[index].totalwithoutTax = Number(this.addedProducts[index].totalwithoutTax.toFixed(2));

       this.addedProducts[index].total=this.addedProducts[index].totalwithoutTax;
       this.addedProducts[index].total=Number( this.addedProducts[index].total.toFixed(2))
      }
      if(this.addedProducts[index].tax==null || this.addedProducts[index].tax==0){
        // alert('in3')
        this.addedProducts[index].total=this.addedProducts[index].totalwithoutTax
        this.addedProducts[index].total=Number( this.addedProducts[index].total.toFixed(2))
      }
      else{
        this.addedProducts[index].total=((Number(this.addedProducts[index].tax)/100)*Number(this.addedProducts[index].totalwithoutTax))+Number(this.addedProducts[index].totalwithoutTax)
        this.addedProducts[index].total=Number( this.addedProducts[index].total.toFixed(2))
      }
    }
    deleteRowDevice(index: number) {
      this.addedProducts.splice(index, 1);
      this.valiedproducts
      if(this.addedProducts.length == 0){
        this.addedProducts.push({
          "product_id":null,
            "quantity":0,
            "max_qty":0,
            "maxQuantity":1000000000,
            "price":0,
            "discount":0,
            "tax":0,
            "total":0,
            "totalwithoutTax":0,
            "uuid":null,
            "discount_type" : 1,
            "discount_value" :0
        });
       
      }
      this.setCardData()
    }


    length:any
removeEmptyProduct(){
  this.length=this.addedProducts.length
  if((!this.addedProducts[this.length-1]?.product_id &&
     !this.addedProducts[this.length-1]?.max_qty &&
     !this.addedProducts[this.length-1]?.price &&
     !this.addedProducts[this.length-1]?.discount &&
     !this.addedProducts[this.length-1]?.tax
  ) && this.length>1){
 this.addedProducts.pop()
  }

}
setPrice(index:number,product_id:any){
  const Product_index=  this.products.findIndex((c:any)=>c.uuid==product_id)
    if(Product_index>-1){
       this.addedProducts[index].price=this.products[Product_index].price
    }
  }
  checkValidAddedProducts(){
    this.length=this.addedProducts.length;
    if(this.length>1 &&  (!this.addedProducts[this.length-1].product_id || !this.addedProducts[this.length-1].max_qty || !this.addedProducts[this.length-1].price)){
      return false;
    }
     return true
  }
  
checkValidProducts(){
  this.valiedproducts = [];
  // this.addedProducts.pop()
 this.removeEmptyProduct()

 
 this.length=this.addedProducts.length

 if((!this.addedProducts[this.length-1].product_id || this.addedProducts[this.length-1].max_qty <= 0 || this.addedProducts[this.length-1].price < 0) || this.length == 0){
  this.valiedproducts = [];
   return false
 }
 else{
  this.addedProducts.forEach((element:any)=>{
    if(element.product_id && 
       element.max_qty && 
       element.price){
        this.valiedproducts.push(
          {
          'product_id':String(element.product_id),
          'quantity':Number(element.quantity),
          'max_qty':Number(element.max_qty),
          'price':Number(element.price),
          'discount':Number(element.discount),
          'tax':Number(element.tax),
          'discount_type':element.discount_type,
          'discount_value':Number(element.discount_value)
          }
        )
    }
  })
 }
  return true
}
resetCode(){
  this.addDebtNoticeForm.controls['tax_exemption_code'].patchValue(null);
}
submit(){
  let validProducts= this.checkValidProducts();

  this.addDebtNoticeForm.controls['number'].setValue(Number(this.creditNumber))
  this.addDebtNoticeForm.controls['invoice_id'].setValue(this.invoice.uuid)
  this.addDebtNoticeForm.controls['total'].setValue(this.total)
  if(this.note){
    this.addDebtNoticeForm.controls['notes'].setValue(this.note)
  }
  if(validProducts){
    this.addDebtNoticeForm.controls['products'].setValue(this.valiedproducts)
  }
  let temp_date = this.created_at;
  let temp_invoice_due = this.invoice_due;
  if(this.created_at && this.invoice_due){
   
    // let temp_invoice_due = this.invoice_due;
      this.addDebtNoticeForm.controls['date'].patchValue(this.changelang.getSaudiDate(this.created_at));
      // this.invoice_due = temp_invoice_due;
      this.addDebtNoticeForm.controls['due_date'].patchValue(this.changelang.getSaudiDate(this.invoice_due));
  }

  if(this.addDebtNoticeForm.valid && validProducts){

   // todo -> zeroTax
  // const hasNullTax = this.addedProducts.some(product => (product.tax === null || product.tax === 0));
  // if(!hasNullTax) this.resetCode();
        this.subs.add(this.http.postReq(`api/dashboard/invoices/${this.uuid}/credit_notes`,this.addDebtNoticeForm.value).subscribe({
          next:res=>{
            if(this.language=='en'){
              this.toastr.info("credit notes added successfully")
            }
            else{
              this.toastr.info("تمت إضافة اشعار الدائن بنجاح")
            }
            debounceTime(2000)
            this.router.navigate(['user/invoices/All-credit-notes'])
          }
        })) 

  }
  else{

    this.addDebtNoticeForm.controls['date'].patchValue(temp_date);
      this.addDebtNoticeForm.controls['due_date'].patchValue(temp_invoice_due);

    if(this.language=='en'){
      this.toastr.error('please Enter All Product Required Values First')
    }
    else{
      this.toastr.error('الرجاء إدخال جميع القيم المطلوبة للمنتجات أولاً');
    }
    
    this.addDebtNoticeForm.markAllAsTouched();
    // this.changeLang.scrollToTop();
    this.changeLang.scrollToInvalidInput(this.addDebtNoticeForm);
   }



    }
    @ViewChild('downloadBtn') downloadBtn!: ElementRef<HTMLElement>;
    downloadPdfBtn() {
        let el: HTMLElement = this.downloadBtn.nativeElement;
        el.click();
    }
    downloadPdf(){
      this.download_pdfService.downloadCreditNotes(this.creditNotes.uuid);

      //  this.downloadBoo = true ;
      //  setTimeout(() => {
      //   this.downloadPdfBtn()
      //  }, 300);
      }


      Back(){
        this._location.back();
      }
   
      checkMax_Min(index : number){
        if(Number(this.addedProducts[index].max_qty) < 0 || Number(this.addedProducts[index].max_qty) > Number(this.addedProducts[index].maxQuantity)){
          this.addedProducts[index].max_qty = this.addedProducts[index].maxQuantity;

          this.setValue(index,this.addedProducts[index].maxQuantity)
          this.getTotalWithoutTax(index);
          this.setCardData()
        }
      }

      setValue(index: number, value: number) {

        const inputElement = document.getElementById(`productQuantity${index}`) as HTMLInputElement;
        if (inputElement) {
          inputElement.value = value.toString();
        } else {
          console.error('Input element not found!');
        }
       
      }


      submitCreditToZatca(){
        if(this.creditNotes.zatca_check_parent_invoice){
        this.subs.add(this.http.postReq(`api/dashboard/credit_notes/send-to-ztaca/${this.uuid}`).subscribe({
          next:res=>{
            if(res.status){
              this.creditNotes.zatca_stage = res?.zatca_stage;
              this.creditNotes.zatca_send_status = 1;
              if(this.language=='en'){
               
                this.toastr.success('Sent Successfully')
              }
              else{
                this.toastr.success('تم الارسال بنجاح')
              }
              if(res?.qr_code){
                this.myAngularxQrCode = res?.qr_code
              }
            }else{
              if(this.language=='en'){
                this.toastr.error('Failed to Send')
              }
              else{
                this.toastr.error('فشل فى الارسال ')
              }
              
            }
      
            if(res.zatca_errors){
              this.creditNotes.zatca_errors = res?.zatca_errors;
            }
            if(res.zatca_warnings){
              this.creditNotes.zatca_warnings = res?.zatca_warnings;
            }
            
            if((res.zatca_errors?.length ?? 0)> 0){
            
              this.creditNotes.zatca_errors = res?.zatca_errors;
              this.creditNotes.eligible_sending_zatca = true;
              this.creditNotes.zatca_send_status = 0;
            }
            else if( (res.zatca_warnings?.length ?? 0)> 0){
      
              this.creditNotes.zatca_warnings = res?.zatca_warnings;
              this.creditNotes.eligible_sending_zatca = true;
              this.creditNotes.zatca_send_status = 1;
            }
           
          },error:(err)=>{
            
            if(err?.redirect_to_edit){
              this.toastr.clear();
              if(this.language=='en'){
                this.toastr.error('Please Complete Client  data')
              }
              else{
                this.toastr.error('يرجى إكمال بيانات العميل')
              }
              this.router.navigate(['/user/users/edit-user',err?.client_id])
            }
            else if((err.zatca_errors?.length ?? 0)> 0){
            
              this.creditNotes.zatca_errors = err?.zatca_errors;
              this.creditNotes.eligible_sending_zatca = true;
              this.creditNotes.zatca_send_status = 0;
            }
            else if( (err.zatca_warnings?.length ?? 0)> 0){
      
              this.creditNotes.zatca_warnings = err?.zatca_warnings;
              this.creditNotes.eligible_sending_zatca = true;
              this.creditNotes.zatca_send_status = 1;
            }
      
            if(err?.zatca_stag){
              this.creditNotes.zatca_stage = err?.zatca_stage;
            }
            if(err.zatca_errors){
              this.creditNotes.zatca_errors = err?.zatca_errors;
            }
            if(err.zatca_warnings){
              this.creditNotes.zatca_warnings = err?.zatca_warnings;
            }
          }
        }))
       }else{
        if(this.language=='en'){
          this.toastr.error('Please Send Invoice to Zatca first')
        }
        else{
          this.toastr.error('يرجى ارسال الفاتورة الى هيئة الزكاة أولاً ')
        }
       }
      }

}
