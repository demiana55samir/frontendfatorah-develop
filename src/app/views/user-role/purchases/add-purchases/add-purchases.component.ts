import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { product } from '@modules/product';
import { expense, payment } from '@modules/purchase';
import { supplier } from '@modules/supplier';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
const datePipe = new DatePipe('en-EG');

interface currency{
  currency_code: string
  name:string
  rate:number
}

@Component({
  selector: 'app-add-purchases',
  templateUrl: './add-purchases.component.html',
  styleUrls: ['./add-purchases.component.scss'],
})
export class AddPurchasesComponent implements OnInit {
  options = [{ name: 'item1' }, { name: 'item1' }, { name: 'item1' }];
  files: File[] = [];
  formDataPayLoad = new FormData();
  addPurchaseForm!: FormGroup;
  // paymentType = [{ name: 'cash', val: 'cash' }];
  paymentType = [];
  // currency = [{ name: 'SAR' }];
  currency:currency[] = [];
  subs = new Subscription();
  language: any;

  selectedTypes = 1;
  selectedTypes1 = 1;
  is_imported = 0;
  purchase_types = [
    {
      id: 1,
      img: './assets/images/invoices/Tax_invoice.svg',
      name_ar: ' مشترى بفاتورة ',
      name_en: ' Purchase with invoice',
    },
    {
      id: 0,
      img: './assets/images/invoices/Non-tax_invoice.svg',
      name_ar: ' مصروف ',
      name_en: ' Expense ',
    },
  ];
  invoices_types = [
    {
      id: 1,
      img: './assets/images/invoices/Tax_invoice.svg',
      name_ar: ' ضريبية',
      name_en: 'Tax invoice',
    },
    {
      id: 0,
      img: './assets/images/invoices/Non-tax_invoice.svg',
      name_ar: ' غير ضريبية',
      name_en: 'Non-tax invoice',
    },
  ];

  imported_types = [
    {
      id: 1,
      img: './assets/images/purchases/file-arrow-left.svg',
      name_ar: ' مستوردة',
      name_en: 'Imported',
    },
    {
      id: 0,
      img: './assets/images/purchases/file-text.svg',
      name_ar: ' غير مستوردة',
      name_en: 'Not imported',
    },
  ];

  tax = [
    { name: '05%', value: 5 },
    { name: '15%', value: 15 },
    { name: '0%', value: 0 },
    { name: 'معفاة', value: -1 },
  ];

  expenses: expense[] = [];
  purchase: expense[] = [];
  SupplierForm!: FormGroup;

  suppliers: supplier[] = [];
  addedPayments: payment[] = [
    {
      name: {
        ar: '',
        en: '',
      },
      paid_amount: 0,
      converted_amount: 0
    },
  ];
  formType = 'add';
  apiUrl = '';
  purchaseId: string = '';
  fileType = '';

  taxCodes:{code:string,name:string}[] = [];

  exmpTaxCodes = [
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
  zeroTaxCodes = [
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
  ]

  conversion_rate:number = 1;
  rate_is_changed:boolean = false;
  currentCurrency:currency = {} as currency;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private qrcode: NgxScannerQrcodeService,
    private validationserv: ValidationService,
    private activeRoute: ActivatedRoute,
    private changeLang: ChangeLanguageService,
    private http: HttpService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.purchaseId = this.activeRoute.snapshot.paramMap.get('uuid') || '';
  }

  ngOnInit() {
    // this.getType(this.router.url);
    this.language = this.changeLang.local_lenguage;

    if(this.language == 'en') {
      this.tax = this.tax.map(item => {
        if (item.name === 'معفاة') {
          return {...item, name: 'Exempt'};
        }
        return item;
      });
    }
    if (this.language == 'ar') {
      // this.paymentType = [{ name: 'نقداً', val: 'cash' }];
      // this.currency = [{ name: 'ريال سعودي' }];
    }
    this.getPaymentMethods();
    this.getExpensesType();
    this.getSupplier();
    this.getCurrencySAR();
    this.addPurchaseForm = this.fb.group({
      number: [''],
      code_number: ['',Validators.required],
      expenses_id: [null, Validators.required],
      currency: ['SAR', Validators.required],
      total: ['', Validators.required],
      converted_amount:['',Validators.required],
      conversion_rate:['', Validators.required],
      rate_is_changed:[false],
      
      purchase_date: ['', Validators.required],
      recipient: ['', Validators.required],
      date: ['', Validators.required],
      payments: [''],
     
      payment_method: ['', Validators.required],
      notes: [''],
      image: [''],
      status: ['', Validators.required],
    
     

      supplier_id: [''],
      tax_amount: [0],
      purchasing_uuid: [''],
      is_taxable: ['', Validators.required],

      tax_rate: [15],
      is_imported: [0],
      has_taxable_inoivce: [1],
      tax_exemption_code:['']

     
    });

    this.addPurchaseForm.controls['status'].setValue(this.selectedTypes);

    this.SupplierForm = this.fb.group({
      tax_number: [''],
      name: this.fb.group({
        ar: [
          '',
          Validators.compose([
            Validators.pattern(this.validationserv.textOnly),
            Validators.required,
          ]),
        ],
        en: [
          '',
          Validators.compose([
            Validators.pattern(this.validationserv.textOnly),
            Validators.required,
          ]),
        ],
      }),
    });
  }

  updatePaymentsAmountArray(){
    if(this.addedPayments.length > 0){
      this.addedPayments.forEach((element:any,index:number) =>{
        this.addedPayments[index].paid_amount = this.addedPayments[index].converted_amount * this.conversion_rate;
        this.addedPayments[index].paid_amount = Number(this.addedPayments[index].paid_amount.toFixed(2))
      })
    }
  }
  updatePaymentAmount(paymentIndex:number){
    this.addedPayments[paymentIndex].paid_amount = this.addedPayments[paymentIndex].converted_amount * this.conversion_rate;
    this.addedPayments[paymentIndex].paid_amount = Number(this.addedPayments[paymentIndex].paid_amount.toFixed(2))
  }
  updateExchangeAmount(){
   
    // console.log('conversion_rate',this.conversion_rate);
    // console.log('controls' ,this.addPurchaseForm.controls['conversion_rate'].value);
    this.conversion_rate = Number(this.addPurchaseForm.controls['conversion_rate'].value)
    // this.addPurchaseForm.controls['conversion_rate'].setValue(this.conversion_rate,{ emitEvent: false })
    this.updateTotalAmount();
    this.updatePaymentsAmountArray();
  }

  enableChangeExchangeRate:boolean = true;
  @ViewChild('buttonRef') buttonRef!: ElementRef;

  changeExchangeRate(event:any){
    this.rate_is_changed = !this.rate_is_changed;

    if(!this.rate_is_changed){
      let currentCurrencyVal = this.addPurchaseForm.controls['currency'].value
      let currentCurrencyindex = this.currency.findIndex((currency:any) => currency.currency_code == currentCurrencyVal)
      if(currentCurrencyindex > -1){
         this.conversion_rate = this.currency[currentCurrencyindex].rate
        //  this.conversion_rate = 1 / Number(this.conversion_rate.toFixed(2));
         this.conversion_rate = Number((1 / this.conversion_rate).toFixed(2));
         this.conversion_rate = Number(this.conversion_rate.toFixed(2));
      }

      this.addPurchaseForm.controls['conversion_rate'].setValue(this.conversion_rate,{ emitEvent: false })
    }

  }


  chooseCurrency(currentCurrencyVal:any){
      let currentCurrencyindex = this.currency.findIndex((currency:any) => currency.currency_code == currentCurrencyVal)
      if(currentCurrencyindex > -1){
        this.currentCurrency = this.currency[currentCurrencyindex];
         this.conversion_rate = this.currency[currentCurrencyindex].rate
         this.conversion_rate = Number((1 / this.conversion_rate).toFixed(2));

         this.conversion_rate = Number(this.conversion_rate.toFixed(2));
      }

      this.addPurchaseForm.controls['conversion_rate'].setValue(this.conversion_rate,{ emitEvent: false })

  }
  checkConversionRateChanged(){
    let currentCurrencyVal = this.addPurchaseForm.controls['currency'].value;
    let originalConvRate ;
    let currentCurrencyindex = this.currency.findIndex((currency:any) => currency.currency_code == currentCurrencyVal)
    if(currentCurrencyindex > -1){

       originalConvRate = this.currency[currentCurrencyindex].rate
      //  originalConvRate = 1 / Number(originalConvRate.toFixed(2));
       originalConvRate = Number((1 / originalConvRate).toFixed(2));
       originalConvRate = Number(originalConvRate.toFixed(2));
    }
  
    return (this.conversion_rate == originalConvRate);
  }
  totalAmount = 0;
  totalAmountInCurrency = 0;
  updateTotalAmount() {

    let amount = 0;
    let ConvAmount = Number(this.addPurchaseForm.controls['converted_amount'].value);
    // let currentCurrencyVal = this.addPurchaseForm.controls['currency'].value
    // let currentCurrencyindex = this.currency.findIndex((currency:any) => currency.currency_code == currentCurrencyVal)
    if(this.conversion_rate >= 0){
      //  this.conversion_rate = this.currency[currentCurrencyindex].rate
      // console.log(Number(this.conversion_rate.toFixed(2)));
      //  this.conversion_rate = 1 / Number(this.conversion_rate.toFixed(2));
      //  this.conversion_rate =1 / this.conversion_rate;
       amount = ConvAmount * this.conversion_rate;
       amount = Number(amount.toFixed(2))
       this.addPurchaseForm.controls['total'].setValue(amount,{ emitEvent: false })
    }
   
    if(this.addPurchaseForm.controls['tax_rate'].value == -1){
      this.taxCodes = this.exmpTaxCodes;
    }else if(this.addPurchaseForm.controls['tax_rate'].value == 0){
      this.taxCodes = this.zeroTaxCodes;
    }

    let tax = Number(this.addPurchaseForm.controls['tax_rate'].value);
    if(tax > 0){
      tax /= 100;
    }

    let totalConverted = Number(ConvAmount);
    if(tax > 0){

      totalConverted +=   Number(ConvAmount) * tax;
    }
    this.totalAmountInCurrency = Number(totalConverted.toFixed(2));

    let total_amount = Number(amount);
   
    if(tax > 0){
      total_amount = total_amount + (Number(amount) * tax);
    }
  
    this.totalAmount =  Number(total_amount.toFixed(2));

    if(!this.addPurchaseForm.controls['tax_exemption_code'].value && [-1,0].includes(Number(this.addPurchaseForm.controls['tax_rate'].value))){
      this.addPurchaseForm.controls['tax_exemption_code'].setValue(this.taxCodes[0].code, { emitEvent: false });
    } 

    // let amount = Number(this.addPurchaseForm.controls['total'].value);
    // let tax = Number(this.addPurchaseForm.controls['tax_amount'].value);

    // let total_amount = amount + tax;
    // this.totalAmount = total_amount;
  }

  choose_taxCodes(){

  }
  getType(url: string) {
    if (url.includes('edit')) {
      this.formType = 'edit';
    } else if (url.includes('add')) {
      this.formType = 'add';
    }
  }
  getPurchaseDetails() {
    this.http.getReq(`api/dashboard/purchasings/${this.purchaseId}`).subscribe({
      next: (res) => {
        // this.expenses = res.data;
        let purchase = res.data;
        this.selectedTypes = purchase.status;
        // this.fileChoosed = purchase.image;
        this.fileUrl = purchase.image;
        this.fileType = this.getFileType(this.fileUrl);

        this.fillPaymentList(res?.data?.payments);
        this.addPurchaseForm.controls['expenses_id'].patchValue(
          res?.data?.expenses_types.id
        );

        if (res?.data?.date) {
          const date = res?.data?.date.split('-');
          const newDate = new Date(+date[0], +date[1] - 1, +date[2]);
          this.addPurchaseForm.controls['date'].patchValue(newDate);
        }

        if (res?.data?.purchase_date) {
          const purchase_date = res?.data?.purchase_date.split('-');
          const newPurchase_date = new Date(
            +purchase_date[0],
            +purchase_date[1] - 1,
            +purchase_date[2]
          );
          this.addPurchaseForm.controls['purchase_date'].setValue(
            newPurchase_date
          );
        }

        if (res?.data?.image) {
          this.formDataPayLoad.append('image', res?.data?.image);
        }

        let purchaseData = {
          number: res?.data?.number,
          code_number: res?.data?.code_number,
          total: res?.data?.total,
          recipient: res?.data?.recipient,
          currency: res?.data?.currency,
          payment_method: res?.data?.payment_method,
          notes: res?.data?.notes,
          status: res?.data?.status,
          expenses_id: res?.data?.expenses_types.id,
          supplier_id: res?.data?.supplier,
          tax_amount: res?.data?.tax_amount,
          image: res?.data?.image,
          purchasing_uuid: this.purchaseId,
        };

        this.addPurchaseForm.patchValue(purchaseData);
      },
    });
  }

  fillPaymentList(paymentList: any) {
    if (paymentList && paymentList.length > 0) {
      this.addedPayments = [];
      paymentList.forEach((element: any) => {
        let item: payment = {
          name: {
            ar: element.name,
            en: element.name,
          },
          paid_amount: Number(element.paid_amount),
          converted_amount: Number(element.converted_amount),
        };
        this.addedPayments.push(item);
      });
    }
  }

  getExpensesType() {
    this.http.getReq('api/dashboard/expenses_types').subscribe({
      next: (res) => {
        this.expenses = res.data.expense;
        this.purchase = res.data.purchase;
      },
    });
  }
  getPaymentMethods() {
    this.http.getReq('api/localPaymentMethods').subscribe({
      next: (res) => {
        this.paymentType = res
      },
    });
  }

  getSupplier() {
    this.http.getReq('api/dashboard/suppliers').subscribe({
      next: (res) => {
        this.suppliers = res.data;
      },
    });
  }
  getCurrencySAR() {
    this.http.getReq('api/sar-currency-rates').subscribe({
      next: (res) => {
        this.currency = res.data;

        let currentCurrencyindex = this.currency.findIndex((currency:any) => currency.currency_code == 'SAR')
        if(currentCurrencyindex > -1){
          this.currentCurrency = this.currency[currentCurrencyindex];
        }else{
          this.currentCurrency = this.currency[0];
          this.addPurchaseForm.controls[''].setValue(this.currency[0].currency_code);
        }

        
      },
    });
  }

  AddSupplier() {
    let currentName = this.SupplierForm.get('name.ar')?.value;
    console.log(currentName);
    this.SupplierForm.get('name')?.setValue({
      ar: currentName,
      en: currentName,
    });

    if (this.SupplierForm.valid && this.SupplierForm.dirty) {
      this.subs.add(
        this.http
          .postReq('api/dashboard/suppliers', this.SupplierForm.value)
          .subscribe({
            next: (res) => {
              // let newSupplier:supplier = {
              //   name :'',
              //   supplier_id :''
              // }
              // this.suppliers.push({})
              this.suppliers.push(res?.data);
              this.addPurchaseForm.controls['supplier_id'].patchValue(
                res?.data?.supplier_id
              );
            },
            complete: () => {
              if (this.language == 'en') {
                this.toastr.info('Supplier added successfully');
              } else {
                this.toastr.info('تمت إضافة المورد بنجاح');
              }
              this.SupplierForm.reset();
            },
            error: () => {
              // this.SupplierForm.controls['name'].setValue(this.name.ar)
            },
          })
      );
    } else {
      this.SupplierForm.markAllAsTouched();
      if (this.language == 'en') {
        this.toastr.error('Please enter Data first');
      } else {
        this.toastr.error('الرجاء إدخال البيانات أولاً');
      }
    }
  }

  getValidPayments() {
    let validPayments: payment[] = [];
    this.addedPayments.forEach((payment) => {
      if (payment.name.ar.length > 0 && payment.paid_amount > -1) {
        payment.name.en = payment.name.ar;
        payment.paid_amount = Number(payment.paid_amount);
        payment.converted_amount = Number(payment.converted_amount);
        validPayments.push(payment);
      }
    });

    return validPayments;
  }
  purchaseNum: any;
  addPrurchase() {

    // if(this.checkConversionRateChanged()){
      this.addPurchaseForm.controls['rate_is_changed'].patchValue(!this.checkConversionRateChanged())
    // }
 
    this.formDataPayLoad.append(
      'rate_is_changed',
      this.addPurchaseForm.controls['rate_is_changed'].value
    );
    this.formDataPayLoad.append(
      'conversion_rate',
      this.addPurchaseForm.controls['conversion_rate'].value
    );
    this.formDataPayLoad.append(
      'converted_amount',
      this.addPurchaseForm.controls['converted_amount'].value
    );
  
    this.addPurchaseForm.controls['number'].setValue(Number(this.newNumber));
    this.formDataPayLoad.append(
      'number',
      this.addPurchaseForm.controls['number'].value
    );
    this.formDataPayLoad.append(
      'code_number',
      this.addPurchaseForm.controls['code_number'].value
    );
    if (this.addPurchaseForm.controls['total'].value) {
      this.formDataPayLoad.append(
        'total',
        this.addPurchaseForm.controls['total'].value
      );
    }
    if (this.addPurchaseForm.controls['recipient'].value) {
      this.formDataPayLoad.append(
        'recipient',
        this.addPurchaseForm.controls['recipient'].value
      );
    }
    if (this.addPurchaseForm.controls['date'].value) {
      let formatedDate: any = datePipe.transform(
        this.addPurchaseForm.controls['date'].value,
        'yyyy-MM-dd'
      );
      this.formDataPayLoad.append('date', formatedDate);
    }
    if (
      this.selectedTypes == 1 &&
      this.addPurchaseForm.controls['purchase_date'].value
    ) {
      let formatedDate: any = datePipe.transform(
        this.addPurchaseForm.controls['purchase_date'].value,
        'yyyy-MM-dd'
      );
      this.formDataPayLoad.append('purchase_date', formatedDate);
    }
    if (this.addPurchaseForm.controls['currency'].value) {
      this.formDataPayLoad.append(
        'currency',
        this.addPurchaseForm.controls['currency'].value
      );
    }
    if (this.addPurchaseForm.controls['payment_method'].value) {
      this.formDataPayLoad.append(
        'payment_method',
        this.addPurchaseForm.controls['payment_method'].value
      );
    }
    if (this.addPurchaseForm.controls['notes'].value) {
      this.formDataPayLoad.append(
        'notes',
        this.addPurchaseForm.controls['notes'].value
      );
    }
    if (this.addPurchaseForm.controls['tax_amount'].value) {
      this.formDataPayLoad.append(
        'tax_amount',
        this.addPurchaseForm.controls['tax_amount'].value
      );
    }

    // new three values
    // if(this.addPurchaseForm.controls['tax_rate'].value){
    this.formDataPayLoad.append(
      'tax_rate',
      this.addPurchaseForm.controls['tax_rate'].value
    );
    // }

    if (this.addPurchaseForm.controls['tax_exemption_code'].value) {
      this.formDataPayLoad.append( 'tax_exemption_code',this.addPurchaseForm.controls['tax_exemption_code'].value
      );
    }
   

    if ([0, 1].includes(this.addPurchaseForm.controls['is_imported'].value)) {
      this.formDataPayLoad.append(
        'is_imported',
        this.addPurchaseForm.controls['is_imported'].value
      );
    }
    if (
      [0, 1].includes(
        this.addPurchaseForm.controls['has_taxable_inoivce'].value
      )
    ) {
      this.formDataPayLoad.append(
        'has_taxable_inoivce',
        this.addPurchaseForm.controls['has_taxable_inoivce'].value
      );
    }

    //add type of purchase
    this.addPurchaseForm.controls['status'].patchValue(this.selectedTypes);
    this.formDataPayLoad.append(
      'status',
      this.addPurchaseForm.controls['status'].value
    );
    this.formDataPayLoad.append(
      'expenses_id',
      this.addPurchaseForm.controls['expenses_id'].value
    );
    this.formDataPayLoad.append(
      'supplier_id',
      this.addPurchaseForm.controls['supplier_id'].value
    );

    let validPayments: payment[] = this.getValidPayments();
    validPayments.forEach((element, index) => {
      this.formDataPayLoad.append(
        `payments[${index}][name][ar]`,
        JSON.stringify(element.name.ar)
      );
      this.formDataPayLoad.append(
        `payments[${index}][name][en]`,
        JSON.stringify(element.name.en)
      );
      this.formDataPayLoad.append(
        `payments[${index}][paid_amount]`,
        JSON.stringify(element.paid_amount)
      );
      this.formDataPayLoad.append(
        `payments[${index}][converted_amount]`,
        JSON.stringify(element.converted_amount)
      );
    });

    this.addPurchaseForm.controls['is_taxable'].setValue(this.isTaxable);

    this.subs.add(
      this.http
        .postReq('api/dashboard/purchasings', this.formDataPayLoad)
        .subscribe({
          next: (res) => {
            this.formDataPayLoad = new FormData();
          },
          error: (error) => {
            if (error) {
              let newFormData = new FormData();

              this.formDataPayLoad.forEach((value, key) => {
                if (key == 'image') {
                  newFormData.append(key, value);
                }
              });
              // this.changeLang.scrollToTop();
              this.changeLang.scrollToInvalidInput(this.addPurchaseForm);
              this.formDataPayLoad = newFormData;
            }
          },
          complete: () => {
            let user: any = this.auth.getUserObj();

            user.products_count =
              Number(this.auth.getUserObj().products_count) + 1;
            localStorage.removeItem('UserObj');
            this.auth.setUserObj(user);
            if (this.language == 'en') {
              this.toastr.info('purchase added sucessfully');
            } else {
              this.toastr.info('تمت إضافة المشتري بنجاح');
            }
            // this.formDataPayLoad = new FormData();
            // this.addPurchaseForm.reset();
            // this.files=[]
            // this.getAllPurchase()
            this.router.navigate(['/user/purchases/All-purchases']);
          },
        })
    );
  }
  purchases: any;
  // getAllPurchase(){
  //   this.subs.add(this.http.getReq('api/dashboard/purchasings').subscribe({
  //     next:res=>{
  //       this.purchases=res.data
  //     },complete:()=> {
  //       const index= this.purchases.findIndex((c:any)=> c.number == this.newNumber)
  //           if(index>-1){
  //             this.router.navigate(['/user/purchases/purchases-details/','new',this.purchases[index].uuid])
  //           }
  //     },
  //   }))
  // }
  newNumber: any;
  showrequired: any = false;
  getNewNumber() {
    this.addPurchaseForm.controls['is_taxable'].setValue(this.isTaxable);
    this.formDataPayLoad.append(
      'is_taxable',
      this.addPurchaseForm.controls['is_taxable'].value
    );

    if (this.selectedTypes == 0) {
      // this.addPurchaseForm.controls['purchase_date'].removeValidators(Validators.required);
      // this.addPurchaseForm.controls['code_number'].removeValidators(Validators.required);
      // this.addPurchaseForm.controls['converted_amount'].removeValidators(Validators.required);
      // this.addPurchaseForm.controls['conversion_rate'].removeValidators(Validators.required);

      this.addPurchaseForm.controls['code_number'].clearValidators(); 
      this.addPurchaseForm.controls['code_number'].updateValueAndValidity(); 
      this.addPurchaseForm.controls['purchase_date'].clearValidators(); 
      this.addPurchaseForm.controls['purchase_date'].updateValueAndValidity(); 
      this.addPurchaseForm.controls['converted_amount'].clearValidators(); 
      this.addPurchaseForm.controls['converted_amount'].updateValueAndValidity(); 
      this.addPurchaseForm.controls['conversion_rate'].clearValidators(); 
      this.addPurchaseForm.controls['conversion_rate'].updateValueAndValidity(); 

      // this.addPurchaseForm.removeControl('code_number');
      // this.addPurchaseForm.removeControl('converted_amount');
      // this.addPurchaseForm.removeControl('conversion_rate');
    }
    console.log(this.addPurchaseForm);
    this.formDataPayLoad.append(
      'expenses_id',
      this.addPurchaseForm.controls['expenses_id'].value
    );
    if (
      // this.files &&
      // this.fileChoosed
      (this.selectedTypes == 1 &&
        this.addPurchaseForm.valid &&
        this.addPurchaseForm.dirty 
      ) ||
      (this.selectedTypes == 0 &&
        this.addPurchaseForm.valid &&
        this.addPurchaseForm.dirty)
    ) {
      this.newNumber = 0;
      this.subs.add(
        this.http.getReq('api/dashboard/purchasings/create').subscribe({
          next: (res) => {
            this.newNumber = res.purchase_number;
            this.addPrurchase();
          },
          error: () => {
            // this.addPurchaseForm.controls['purchase_date'].addValidators(Validators.required);
            // this.addPurchaseForm.controls['code_number'].addValidators(Validators.required);
            // this.addPurchaseForm.controls['converted_amount'].addValidators(Validators.required);
            // this.addPurchaseForm.controls['conversion_rate'].addValidators(Validators.required);
            
            this.addPurchaseForm.controls['code_number'].setValidators([Validators.required]);  
            this.addPurchaseForm.controls['code_number'].updateValueAndValidity();  
            this.addPurchaseForm.controls['purchase_date'].setValidators([Validators.required]);  
            this.addPurchaseForm.controls['purchase_date'].updateValueAndValidity();  
            this.addPurchaseForm.controls['converted_amount'].setValidators([Validators.required]);  
            this.addPurchaseForm.controls['converted_amount'].updateValueAndValidity();  
            this.addPurchaseForm.controls['conversion_rate'].setValidators([Validators.required]);  
            this.addPurchaseForm.controls['conversion_rate'].updateValueAndValidity();  
            // this.addPurchaseForm.addControl('purchase_date', [
            //   Validators.required,
            // ]);
            // this.addPurchaseForm.addControl('code_number', [
            //   Validators.required,
            // ]);
            // this.addPurchaseForm.addControl('converted_amount', [
            //   Validators.required,
            // ]);
            // this.addPurchaseForm.addControl('conversion_rate', [
            //   Validators.required,
            // ]);
          },
        })
      );
    } else {
      if (this.selectedTypes == 1 && this.files.length == 0) {
        this.showrequired = true;
      }
      this.addPurchaseForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.addPurchaseForm);
      if (this.language == 'en') {
        this.toastr.error('please Enter All Product Required Values First');
      } else {
        this.toastr.error('الرجاء إدخال جميع القيم المطلوبة للمنتجات أولاً');
      }

      // this.addPurchaseForm.controls['purchase_date'].addValidators(Validators.required);
      // this.addPurchaseForm.controls['code_number'].addValidators(Validators.required);
      // this.addPurchaseForm.controls['converted_amount'].addValidators(Validators.required);
      // this.addPurchaseForm.controls['conversion_rate'].addValidators(Validators.required);


      this.addPurchaseForm.controls['code_number'].setValidators([Validators.required]);  
      this.addPurchaseForm.controls['code_number'].updateValueAndValidity();  
      this.addPurchaseForm.controls['purchase_date'].setValidators([Validators.required]);  
      this.addPurchaseForm.controls['purchase_date'].updateValueAndValidity();  
      this.addPurchaseForm.controls['converted_amount'].setValidators([Validators.required]);  
      this.addPurchaseForm.controls['converted_amount'].updateValueAndValidity();  
      this.addPurchaseForm.controls['conversion_rate'].setValidators([Validators.required]);  
      this.addPurchaseForm.controls['conversion_rate'].updateValueAndValidity();  

    }
  }
  editPurchase() {
    this.addPurchaseForm.controls['purchasing_uuid'].setValue(this.purchaseId);
    if (this.addPurchaseForm.valid) {
      this.subs.add(
        this.http
          .putReq(
            `api/dashboard/purchasings/${this.purchaseId}`,
            this.addPurchaseForm.value
          )
          .subscribe({
            next: (res) => {
              console.log(res);
            },
          })
      );
    } else {
      this.addPurchaseForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.addPurchaseForm);
      if (this.language == 'en') {
        this.toastr.error('please Enter All Product Required Values First');
      } else {
        this.toastr.error('الرجاء إدخال جميع القيم المطلوبة للمنتجات أولاً');
      }
    }
  }

  isImageFile(file: File): boolean {
    return file.type.match('image.*') != null;
  }

  isPdfFile(file: File): boolean {
    return file.type === 'application/pdf';
  }
  getImagePreview(file: File): string {
    // Assuming you're creating an object URL for the image preview
    if (file) return URL.createObjectURL(file);

    return '';
  }

  getFileType(fileUrl: string): string {
    if (fileUrl.endsWith('.pdf')) {
      this.fileName = this.extractFileName(fileUrl) || '';
      return 'pdf';
    } else if (fileUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
      return 'image';
    }
    return 'unknown';
  }

  resetExpense() {
    this.addPurchaseForm.controls['expenses_id'].setValue('');
    this.addPurchaseForm.controls['code_number'].setValue(null);
    this.addPurchaseForm.controls['purchase_date'].setValue('');
    this.isTaxable = this.selectedTypes == 1 ? true : false;
  }
  extractFileName(url: string) {
    return url.split('/').pop();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileChoosed = input.files[0];
      this.fileName = input.files[0].name;
      this.showrequired = false;
      const objectUrl = URL.createObjectURL(input.files[0]);
      console.log(objectUrl);
      this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl); // Sanitize the URL
      if (this.isImageFile(this.fileChoosed)) this.fileType = 'image';
      else if (this.isPdfFile(this.fileChoosed)) this.fileType = 'pdf';
      this.formDataPayLoad.append('image', input.files[0]);
      // this.toasterService.success('File selected!');
    }
  }

  isTaxable: boolean = true;

  chooseTaxable(is_Taxable: boolean) {
    this.isTaxable = is_Taxable;
    if (!this.isTaxable) {
      this.addPurchaseForm.controls['tax_amount'].setValue(0);
      this.updateTotalAmount();
    }
  }

  chooseHasInvoiceTaxable(has_taxable_invoice: number) {
    this.addPurchaseForm.controls['has_taxable_inoivce'].setValue(
      has_taxable_invoice
    );
  }
  chooseIsImported(isImported: number) {
    this.addPurchaseForm.controls['is_imported'].setValue(isImported);
  }
  chooseExpense(event: any, type: string) {
    if (type == 'expense') {
      let index = this.expenses.findIndex(
        (item: any) => item.id == event.value
      );
      if (index > -1) {
        this.isTaxable = this.expenses[index].taxable == 1;
        if (!this.isTaxable) {
          this.addPurchaseForm.controls['tax_amount'].setValue(0);
          this.updateTotalAmount();
        }
      }
    } else if (type == 'purchase') {
      let index = this.purchase.findIndex(
        (item: any) => item.id == event.value
      );
      if (index > -1) {
        this.isTaxable = this.purchase[index].taxable == 1;
        if (!this.isTaxable) {
          this.addPurchaseForm.controls['tax_amount'].setValue(0);
          this.updateTotalAmount();
        }
      }
    }
  }

  addQRCode(event: Event): void {
    // const input = event.target as HTMLInputElement;

    // if (input.files && input.files[0]) {
    //   let qrCode = input.files[0];
    //   const objectUrl = URL.createObjectURL(input.files[0]);
    //   this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    //   console.log(qrCode);

    // }

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileChoosed = input.files[0];
      this.fileName = input.files[0].name;
      this.showrequired = false;
      const objectUrl = URL.createObjectURL(input.files[0]);
      console.log(objectUrl);
      this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl); // Sanitize the URL
      if (this.isImageFile(this.fileChoosed)) this.fileType = 'image';
      else if (this.isPdfFile(this.fileChoosed)) this.fileType = 'pdf';

      console.log(input.files[0]);
    }
  }

  public percentage = 200;
  public quality = 100;
  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
      },
    },
  };

  public onSelects(files: any) {
    console.log(files);

    this.qrcode
      .loadFiles(files, this.percentage, this.quality)
      .subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        this.qrCodeResult = res;
        console.log(this.qrCodeResult);
      });
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    if (e.length > 0 && e[0].value) {
      this.sendQRCodeText(e[0].value);
    }
    console.log('e: ', e[0].value);
  }
  sendQRCodeText(qrCodeText: string) {
    let param = {
      qr_code_text: qrCodeText,
    };
    this.subs.add(
      this.http
        .getReq(`api/dashboard/readQrCode/purchasings`, { params: param })
        .subscribe({
          next: (res) => {
            console.log(res);

            // code_number
            this.addPurchaseForm.controls['code_number'].setValue(
              Number(res?.data?.number)
            );
            // total
            this.addPurchaseForm.controls['total'].setValue(
              Number(res?.data?.total)
            );
            // purchase_date
            const dateObject = new Date(res?.data?.created_at);
            this.addPurchaseForm.controls['purchase_date'].setValue(dateObject);

            this.getTotalValues(res?.data?.products);
          },
        })
    );
    this.qrCodeResult = [];
  }
  getTotalValues(products: product[]) {
    let totalTax = 0;
    products.forEach((element) => {
      if (element.tax) {
        totalTax =
          totalTax +
          (element.tax / 100) *
            (Number(element.price) * Number(element.quantity) -
              Number(element.discount));
      }
    });
    // tax_amount
    console.log(totalTax);

    this.addPurchaseForm.controls['tax_amount'].setValue(Number(totalTax));
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    //  const files = event.dataTransfer?.files;
    // if (files && files[0]) {
    //   this.fileChoosed = files[0];
    //   this.fileName = files[0].name;
    //   this.showrequired=false
    //   const objectUrl = URL.createObjectURL(files[0]);
    //   this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl); // Sanitize the URL
    //   this.getFileType(this.fileUrl);
    //   // alert(this.fileUrl)
    //   this.formDataPayLoad.append("image", files[0]);
    //   // this.toasterService.success('File dropped!');
    // }
    const files = event.dataTransfer?.files;
    // const input = event.target as HTMLInputElement;
    if (files && files[0]) {
      this.fileChoosed = files[0];
      this.fileName = files[0].name;
      this.showrequired = false;
      const objectUrl = URL.createObjectURL(files[0]);
      console.log(objectUrl);
      this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl); // Sanitize the URL
      if (this.isImageFile(this.fileChoosed)) this.fileType = 'image';
      else if (this.isPdfFile(this.fileChoosed)) this.fileType = 'pdf';
      this.formDataPayLoad.append('image', files[0]);
    }
  }

  onDragOver(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  removeItem() {
    this.fileName = '';
    this.fileUrl = '';
    this.fileChoosed = null;
    this.formDataPayLoad.delete('image');
    this.showrequired = true;
  }
  fileName: string = '';
  fileUrl: any = '';
  fileChoosed: any;
  increaseDevice() {
    length = this.addedPayments.length;
    if (
      this.addedPayments[this.addedPayments.length - 1].name.ar &&
      this.addedPayments[this.addedPayments.length - 1].paid_amount &&
      this.addedPayments[this.addedPayments.length - 1].converted_amount
    ) {
      this.addedPayments.push({
        name: {
          ar: '',
          en: '',
        },
        paid_amount: 0,
        converted_amount: 0
      });
    } else {
      if (this.language == 'en') {
        this.toastr.error('Please enter all required values ​​in Payments First');
      } else {
        this.toastr.error('الرجاء إدخال جميع القيم المطلوبة فى الدفعات أولاً');
      }
    }
  }

 
  onDragLeave(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
  deleteRowDevice(index: number) {
    this.addedPayments.splice(index, 1);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
