
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { Download_pdfService } from '@services/download_pdf.service';
import { HttpService } from '@services/http.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, debounceTime, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-tax-report',
  templateUrl: './add-tax-report.component.html',
  styleUrls: ['./add-tax-report.component.scss']
})
export class AddTaxReportComponent implements OnInit {

  currentreportType = null;
  currentquarter = null;
  currentmonth = null;
  currentyear = null;

  prevCurrentyear = null
  prevCurrentmonth = null
  prevCurrentreportType = null
  prevCurrentquarter = null

  invoiceIssuedBool = false;
  language:any
  reportType = [
    {
      val:'quarter',
      nameAr:'ربع سنوى',
      nameEn:'Quarterly',
    },
    {
      val:'monthly',
      nameAr:'شهرى ',
      nameEn:'Monthly',
    }
  ];

  quarters = [
    {
      val:1,
      nameAr:'ربع أول',
      nameEn:'First Quarter'
    },
    {
      val:2,
      nameAr:'ربع ثانى',
      nameEn:'Second Quarter'
    },
    {
      val:3,
      nameAr:'ربع ثالث',
      nameEn:'Third Quarter'
    },
    {
      val:4,
      nameAr:'ربع رابع',
      nameEn:'Fourth Quarter'
    },
  ]
  months = [
    { nameAr: "يناير", nameEn: "January", val: 1 },
    { nameAr: "فبراير", nameEn: "February", val: 2 },
    { nameAr: "مارس", nameEn: "March", val: 3 },
    { nameAr: "أبريل", nameEn: "April", val: 4 },
    { nameAr: "مايو", nameEn: "May", val: 5 },
    { nameAr: "يونيو", nameEn: "June", val: 6 },
    { nameAr: "يوليو", nameEn: "July", val: 7 },
    { nameAr: "أغسطس", nameEn: "August", val: 8 },
    { nameAr: "سبتمبر", nameEn: "September", val: 9 },
    { nameAr: "أكتوبر", nameEn: "October", val: 10 },
    { nameAr: "نوفمبر", nameEn: "November", val: 11 },
    { nameAr: "ديسمبر", nameEn: "December", val: 12 }
  ];
  years:any;
  private subs= new Subscription();

  startReport :boolean = false;
  report_id:string = ''
  // form Vars========
  total_for_tax_15=0;
  total_creditNote_tax_15=0;

  total_creditNote_tax_05=0;
  total_for_tax_05=0;

  total_for_citizaen=0;
  total_creditNote_for_citizaen: number = 0;

  total_for_exempt=0;
  total_creditNote_exempt: number = 0;

  total_for_exports=0;
  total_creditNote_exports: number = 0;

  total_for_local=0;
  total_sales=0;

  total_sales_for_tax_05 = 0;
  total_sales_for_tax_15 = 0;
  total_sales_tax = 0;
  total_sales_with_tax = 0;


  total_creditNote_local: number = 0;

  purchasings_not_imported_15: number = 0;
  purchasings_not_imported_05: number = 0;
  purchasings_imported_has_invoice_15: number = 0;
  purchasings_imported_has_invoice_05: number = 0;
  purchasings_imported_not_has_invoice_15: number = 0;
  purchasings_imported_not_has_invoice_05: number = 0;
  purchasings_0_tax: number = 0;
  purchasings_exempt: number = 0;
  total_purchasings: number = 0;
  total_purchasings_canceled: number = 0;
  total_purchasings_withTax: number = 0;

  purchasings_canceled_not_imported_15: number = 0;
  purchasings_canceled_not_imported_05: number = 0;
  purchasings_canceled_imported_has_invoice_15: number = 0;
  purchasings_canceled_imported_has_invoice_05: number = 0;
  purchasings_canceled_imported_not_has_invoice_15: number = 0;
  purchasings_canceled_imported_not_has_invoice_05: number = 0;
  purchasings_canceled_0_tax: number = 0;
  purchasings_canceled_exempt: number = 0;

  purchasings_not_imported_15_withTax: number = 0;
  purchasings_not_imported_05_withTax: number = 0;

 
  total_vat_due_current_period: number = 0;
  corrections_previous_periods: number = 0;
  vat_carried_forward_previous_periods: number = 0;
  net_vat_due_or_refunded: number = 0;
  // =================



  // bool values======
    has_5_perc:boolean = false;
    has_basic_taxable_supplies:boolean = false;

  //==================


  Type:string = '';
  viewOnly:boolean = false;
  constructor(private http:HttpService,
    private changeLang:ChangeLanguageService,
    private toastr: ToastrService,
    private httpClient:HttpClient,
    private download_pdfService:Download_pdfService,
    private activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage;
    const currentYear = new Date().getFullYear();
    // this.currentyear = currentYear;
    this.years = Array.from({ length: 6 }, (_, i) => currentYear - i);
    
    this.Type=String(this.activeRoute.snapshot.paramMap.get('type'))
   
    this.report_id=String(this.activeRoute.snapshot.paramMap.get('id'))
    if(this.Type=='view'){
      this.viewOnly = true;
      this.getSingleReport();
    }else{
      this.viewOnly = false;
    }
    
  }

  change_5_perc(){
    this.has_5_perc = !this.has_5_perc;
    this.updateTaxValues();
  }
  changeInvoiceIssues(e:any){
    this.invoiceIssuedBool = !this.invoiceIssuedBool;
  }

  StartTaxReport(){
    
    if(
      ((this.currentreportType == 'quarter' && this.currentquarter && this.currentyear) &&
       (this.currentyear != this.prevCurrentyear || this.currentquarter != this.prevCurrentquarter || this.currentreportType != this.prevCurrentreportType)) ||
      
       ((this.currentreportType == 'monthly' && this.currentmonth && this.currentyear) &&
       (this.currentyear != this.prevCurrentyear || this.currentmonth != this.prevCurrentmonth ||this.currentreportType != this.prevCurrentreportType))
      ){
    
    // if( this.currentyear != this.prevCurrentyear 
    //   ||( this.currentreportType == 'monthly' && this.currentmonth && this.currentmonth != this.prevCurrentmonth)
    //   ||( this.currentreportType == 'quarter' && this.currentquarter && this.currentquarter != this.prevCurrentquarter)
    //   ||this.currentreportType != this.prevCurrentreportType ){

        let param={
          'year':this.currentyear,
          'month':this.currentmonth,
          'report_type':this.currentreportType,
          'quarter':this.currentquarter
        }
        this.subs.add(this.http.getReq('api/dashboard/reports/tax-return',{params:param}).subscribe({
          next:res=>{
          
            this.prevCurrentyear = this.currentyear;
            this.prevCurrentmonth = this.currentmonth;
            this.prevCurrentreportType = this.currentreportType;
            this.prevCurrentquarter = this.currentquarter;
    
        
    
            this.fillFormData(res);
           
          },

          complete:()=>{
            this.updateTaxValues();
            this.startReport = true;
          }
        })) 

      }else{
        if(this.language=='en'){
          this.toastr.error('please Enter All Required Values First')
        }
        else{
          this.toastr.error('الرجاء إدخال جميع القيم المطلوبة أولاً')
        }
      }

  }

  TaxInput$ = new BehaviorSubject('');
  updateTaxValues(){
    this.subs.add(this.TaxInput$.pipe(
      debounceTime(1800),
    ).subscribe(
      {
        next:() => {
          this.RoundFormData();
          //  =========================== sales ===========================
          // tax 15%
          this.total_sales_for_tax_15 = (Number(this.total_for_tax_15) - Number(this.total_creditNote_tax_15)) * 0.15;
          // tax 05%
          if(this.has_5_perc) 
          this.total_sales_for_tax_05 = (Number(this.total_for_tax_05) - Number(this.total_creditNote_tax_05)) * 0.05;

          // totalSales without tax
          this.total_sales = 
          Number(this.total_for_tax_15) +
          Number(this.total_for_citizaen) +
          Number(this.total_for_local) +
          Number(this.total_for_exports) +
          Number(this.total_for_exempt) ;
          if(this.has_5_perc) this.total_sales += Number(this.total_for_tax_05);

           // total sales Taxs
           this.total_sales_tax = 
           Number(this.total_creditNote_tax_15) +
           Number(this.total_creditNote_for_citizaen) +
           Number(this.total_creditNote_local) +
           Number(this.total_creditNote_exports) +
           Number(this.total_creditNote_exempt) ;

           if(this.has_5_perc) this.total_sales_tax += Number(this.total_creditNote_tax_05);

          // total sales with Taxs
            this.total_sales_with_tax = Number(this.total_sales_for_tax_15);
            if(this.has_5_perc) this.total_sales_with_tax += Number(this.total_sales_for_tax_05)


          //  =========================== purchasings ===========================

         this.total_purchasings = 
         Number(this.purchasings_not_imported_15)+
         Number(this.purchasings_imported_has_invoice_15)+
         Number(this.purchasings_imported_not_has_invoice_15)+
         Number(this.purchasings_0_tax)+
         Number(this.purchasings_exempt) ;

         if(this.has_5_perc){
          this.total_purchasings +=  
           Number(this.purchasings_not_imported_05) +
           Number(this.purchasings_imported_has_invoice_05) +
           Number(this.purchasings_imported_not_has_invoice_05) ;
         }
        //  ----------------------------

        //  this.total_purchasings_not_imported_15 =   
        //   Number(this.purchasings_not_imported_15)+
        //   Number(this.purchasings_canceled_not_imported_15);

        //  this.total_purchasings_not_imported_05 =   
        //   Number(this.purchasings_not_imported_05)+
        //   Number(this.purchasings_canceled_not_imported_05);
        //  -------------------------------

        this.total_purchasings_canceled = 
         Number(this.purchasings_canceled_not_imported_15)+
         Number(this.purchasings_canceled_imported_has_invoice_15)+
         Number(this.purchasings_canceled_imported_not_has_invoice_15)+
         Number(this.purchasings_canceled_0_tax)+
         Number(this.purchasings_canceled_exempt) ;

         if(this.has_5_perc){
          this.total_purchasings_canceled +=  
           Number(this.purchasings_canceled_not_imported_05) +
           Number(this.purchasings_canceled_imported_has_invoice_05) +
           Number(this.purchasings_canceled_imported_not_has_invoice_05) ;
         }
        //  -----------------------------
        // tax 15%
        this.purchasings_not_imported_15_withTax = (Number(this.purchasings_not_imported_15) - Number(this.purchasings_canceled_not_imported_15)) * 0.15;
        // tax 05%
        if(this.has_5_perc) 
        this.purchasings_not_imported_05_withTax = (Number(this.purchasings_not_imported_05) - Number(this.purchasings_canceled_not_imported_05)) * 0.05;

        // ---------------------------------

        this.total_purchasings_withTax =
        Number(this.purchasings_not_imported_15_withTax) ;

        if(this.has_5_perc) 
        this.total_purchasings_withTax += Number(this.purchasings_not_imported_05_withTax) ;
        // -------------------------------------

        this.total_vat_due_current_period =  this.total_sales_with_tax - this.total_purchasings_withTax;
        

        this.net_vat_due_or_refunded = 
        Number(this.total_vat_due_current_period) + 
        Number(this.corrections_previous_periods) + 
        Number(this.vat_carried_forward_previous_periods) ;

        this.RoundFormData();
        }
      }
    ));
    
    this.TaxInput$.next('');

  }

  roundToTwo(value: number | undefined): number {
    const num = Number(value); // Convert the value to a number
    return isNaN(num) ? 0 : Number(num.toFixed(2)); // Check if num is NaN, then round

  }

  RoundFormData() {
    this.total_creditNote_tax_05 = this.roundToTwo(this.total_creditNote_tax_05);
    this.total_creditNote_tax_15 = this.roundToTwo(this.total_creditNote_tax_15);
    this.total_for_citizaen = this.roundToTwo(this.total_for_citizaen);
    this.total_for_exempt = this.roundToTwo(this.total_for_exempt);
    this.total_for_exports = this.roundToTwo(this.total_for_exports);
    this.total_for_local = this.roundToTwo(this.total_for_local);
    this.total_for_tax_05 = this.roundToTwo(this.total_for_tax_05);
    this.total_for_tax_15 = this.roundToTwo(this.total_for_tax_15);
    this.total_sales = this.roundToTwo(this.total_sales);
    this.total_sales_with_tax = this.roundToTwo(this.total_sales_with_tax);

    this.total_creditNote_for_citizaen = this.roundToTwo(this.total_creditNote_for_citizaen);
    this.total_creditNote_local = this.roundToTwo(this.total_creditNote_local);
    this.total_creditNote_exports = this.roundToTwo(this.total_creditNote_exports);
    this.total_creditNote_exempt = this.roundToTwo(this.total_creditNote_exempt);

    this.purchasings_not_imported_15 = this.roundToTwo(this.purchasings_not_imported_15);
    this.purchasings_not_imported_05 = this.roundToTwo(this.purchasings_not_imported_05);
    this.purchasings_imported_has_invoice_15 = this.roundToTwo(this.purchasings_imported_has_invoice_15);
    this.purchasings_imported_has_invoice_05 = this.roundToTwo(this.purchasings_imported_has_invoice_05);
    this.purchasings_imported_not_has_invoice_15 = this.roundToTwo(this.purchasings_imported_not_has_invoice_15);
    this.purchasings_imported_not_has_invoice_05 = this.roundToTwo(this.purchasings_imported_not_has_invoice_05);
    this.purchasings_0_tax = this.roundToTwo(this.purchasings_0_tax);

    this.purchasings_exempt = this.roundToTwo(this.purchasings_exempt);
    this.purchasings_canceled_not_imported_15 = this.roundToTwo(this.purchasings_canceled_not_imported_15);
    this.purchasings_canceled_not_imported_05 = this.roundToTwo(this.purchasings_canceled_not_imported_05);
    this.purchasings_canceled_imported_has_invoice_15 = this.roundToTwo(this.purchasings_canceled_imported_has_invoice_15);
    this.purchasings_canceled_imported_has_invoice_05 = this.roundToTwo(this.purchasings_canceled_imported_has_invoice_05);
    this.purchasings_canceled_imported_not_has_invoice_15 = this.roundToTwo(this.purchasings_canceled_imported_not_has_invoice_15);
    this.purchasings_canceled_imported_not_has_invoice_05 = this.roundToTwo(this.purchasings_canceled_imported_not_has_invoice_05);
    this.purchasings_canceled_0_tax = this.roundToTwo(this.purchasings_canceled_0_tax);
    this.purchasings_canceled_exempt = this.roundToTwo(this.purchasings_canceled_exempt);
    this.total_purchasings = this.roundToTwo(this.total_purchasings);
    this.total_purchasings_canceled = this.roundToTwo(this.total_purchasings_canceled);
    this.total_purchasings_withTax = this.roundToTwo(this.total_purchasings_withTax);

    this.total_vat_due_current_period = this.roundToTwo(this.total_vat_due_current_period);
    
    
    this.corrections_previous_periods = this.roundToTwo(this.corrections_previous_periods);
    this.vat_carried_forward_previous_periods = this.roundToTwo(this.vat_carried_forward_previous_periods);
    this.net_vat_due_or_refunded = this.roundToTwo(this.net_vat_due_or_refunded);

    this.total_sales_for_tax_15 = this.roundToTwo(this.total_sales_for_tax_15);
    this.total_sales_for_tax_05 = this.roundToTwo(this.total_sales_for_tax_05);
    this.purchasings_not_imported_15_withTax = this.roundToTwo(this.purchasings_not_imported_15_withTax);
    this.purchasings_not_imported_05_withTax = this.roundToTwo(this.purchasings_not_imported_05_withTax);
    this.total_sales_tax = this.roundToTwo(this.total_sales_tax);
  }

  fillFormData(formData:any){

    if(this.Type=='view'){
      this.has_5_perc = Boolean(formData?.has_05_tax);
    }
    this.has_basic_taxable_supplies = Boolean(formData?.has_governmen_imported);


    this.total_creditNote_tax_05 = formData?.total_creditNote_tax_05;
    this.total_creditNote_tax_15 = formData?.total_creditNote_tax_15;
    this.total_for_citizaen = formData?.total_for_citizaen;
    this.total_for_exempt = formData?.total_for_exempt;
    this.total_for_exports = formData?.total_for_exports;
    this.total_for_local = formData?.total_for_local;
    this.total_for_tax_05 = formData?.total_for_tax_05;
    this.total_for_tax_15 = formData?.total_for_tax_15;
    this.total_sales = formData?.total_sales;
    this.total_sales_tax = formData?.total_sales_tax;
    this.total_sales_with_tax = formData?.total_sales_with_tax;


    this.total_creditNote_for_citizaen= formData?.total_creditNote_for_citizaen
    this.total_creditNote_local= formData?.total_creditNote_local

    this.total_creditNote_exports = formData?.total_creditNote_exports

    this.total_creditNote_exempt= formData?.total_creditNote_exempt


    this.purchasings_not_imported_15= formData?.purchasings_not_imported_15
    this.purchasings_not_imported_05= formData?.purchasings_not_imported_05
    this.purchasings_imported_has_invoice_15= formData?.purchasings_imported_has_invoice_15
    this.purchasings_imported_has_invoice_05= formData?.purchasings_imported_has_invoice_05
    this.purchasings_imported_not_has_invoice_15= formData?.purchasings_imported_not_has_invoice_15
    this.purchasings_imported_not_has_invoice_05= formData?.purchasings_imported_not_has_invoice_05
    this.purchasings_0_tax= formData?.purchasings_0_tax
    
    this.purchasings_exempt= formData?.purchasings_exempt
    this.purchasings_canceled_not_imported_15= formData?.purchasings_canceled_not_imported_15
    this.purchasings_canceled_not_imported_05=  formData?.purchasings_canceled_not_imported_05
    this.purchasings_canceled_imported_has_invoice_15= formData?.purchasings_canceled_imported_has_invoice_15
    this.purchasings_canceled_imported_has_invoice_05= formData?.purchasings_canceled_imported_has_invoice_05
    this.purchasings_canceled_imported_not_has_invoice_15= formData?.purchasings_canceled_imported_not_has_invoice_15
    this.purchasings_canceled_imported_not_has_invoice_05= formData?.purchasings_canceled_imported_not_has_invoice_05
    this.purchasings_canceled_0_tax= formData?.purchasings_canceled_0_tax
    this.purchasings_canceled_exempt= formData?.purchasings_canceled_exempt
    this.total_purchasings= formData?.total_purchasings
    this.total_purchasings_canceled= formData?.total_purchasings_canceled
    this.total_purchasings_withTax= formData?.total_purchasings_withTax


    this.total_vat_due_current_period = formData?.total_vat_due_current_period;
    // this.corrections_previous_periods = formData?.corrections_previous_periods;
    // this.vat_carried_forward_previous_periods = formData?.vat_carried_forward_previous_periods;
    // this.net_vat_due_or_refunded = formData?.net_vat_due_or_refunded;
  }
  
  printDiv(divId: string) {
    const printContents = document.getElementById(divId)?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload the page to ensure the original contents are restored
    }
  }


 

   // Function to save the specified div as a PDF
   savePdf = false;
   saveDivAsPDF1(divId: string) {
    this.viewOnly = true;
    
    setTimeout(() => {
      const data = document.getElementById(divId);

      if (data) {
        html2canvas(data,{
          backgroundColor: '#ffffff', // Set the background color to white
       
        }).then(canvas => {
          const imgWidth = 210;
          const pageHeight = 297;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          const heightLeft = imgHeight;
  
          
          const contentDataURL = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const position = 0;
          pdf.addImage(contentDataURL, 'JPNG', 0, position, imgWidth, imgHeight);
          pdf.save('TaxReport.pdf');
        });
      }
    }, 300);
   
  }

  saveDivAsPDF(divId: string) {
    this.viewOnly = true;

    setTimeout(() => {
        const data = document.getElementById(divId);

        if (data) {
            html2canvas(data, {
                backgroundColor: '#ffffff', // Set the background color to white
            }).then(canvas => {
                const imgWidth = 210;
                const pageHeight = 290;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;

                const contentDataURL = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                let position = 0;

                pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('TaxReport.pdf');
            });
        }
    }, 300);
}

  


  GenerateReport(){
    let body = {
      // params
      year:this.currentyear,
      month:this.currentmonth,
      report_type:this.currentreportType,
      quarter:this.currentquarter,

      // 2 questions
      has_05_tax:Number(this.has_5_perc),
      has_governmen_imported:Number(this.has_basic_taxable_supplies),

      // ============sales rows================
      // row 1
      total_for_tax_15: this.total_for_tax_15,
      total_creditNote_tax_15:this.total_creditNote_tax_15,
      total_sales_for_tax_15: this.total_sales_for_tax_15,
      // row 1.1
      total_for_tax_05: this.total_for_tax_05,
      total_creditNote_tax_05:this.total_creditNote_tax_05,
      total_sales_for_tax_05: this.total_sales_for_tax_05,
   
      // row 2
      total_for_citizaen: this.total_for_citizaen,
      total_creditNote_for_citizaen:this.total_creditNote_for_citizaen,

      // row 3
      total_for_local: this.total_for_local,
      total_creditNote_local:this.total_creditNote_local,
      // row 4
      total_for_exports: this.total_for_exports,
      total_creditNote_exports:this.total_creditNote_exports,
      // row 5
      total_for_exempt: this.total_for_exempt,
      total_creditNote_exempt:this.total_creditNote_exempt,

      // row 6 - total sales row
      total_sales: this.total_sales,
      total_sales_tax:this.total_sales_tax,
      total_sales_with_tax:this.total_sales_with_tax,

        // ============ End of sales rows================

       // ============sales purchasing================
        // row 7
        purchasings_not_imported_15: this.purchasings_not_imported_15,
        purchasings_canceled_not_imported_15:this.purchasings_canceled_not_imported_15,
        purchasings_not_imported_15_withTax: this.purchasings_not_imported_15_withTax,

        // row 7.1
        purchasings_not_imported_05: this.purchasings_not_imported_05,
        purchasings_canceled_not_imported_05:this.purchasings_canceled_not_imported_05,
        purchasings_not_imported_05_withTax: this.purchasings_not_imported_05_withTax,

         // row 8
         purchasings_imported_has_invoice_15: this.purchasings_imported_has_invoice_15,
         purchasings_canceled_imported_has_invoice_15:this.purchasings_canceled_imported_has_invoice_15,
 
         // row 8.1
         purchasings_imported_has_invoice_05: this.purchasings_imported_has_invoice_05,
         purchasings_canceled_imported_has_invoice_05:this.purchasings_canceled_imported_has_invoice_05,

          // row 9
          purchasings_imported_not_has_invoice_15: this.purchasings_imported_not_has_invoice_15,
          purchasings_canceled_imported_not_has_invoice_15:this.purchasings_canceled_imported_not_has_invoice_15,
  
          // row 9.1
          purchasings_imported_not_has_invoice_05: this.purchasings_imported_not_has_invoice_05,
          purchasings_canceled_imported_not_has_invoice_05:this.purchasings_canceled_imported_not_has_invoice_05,
         
          // row 10
          purchasings_0_tax: this.purchasings_0_tax,
          purchasings_canceled_0_tax:this.purchasings_canceled_0_tax,
          // row 11
          purchasings_exempt: this.purchasings_exempt,
          purchasings_canceled_exempt:this.purchasings_canceled_exempt,

           // row 12 - total purchasings row
          total_purchasings: this.total_purchasings,
          total_purchasings_canceled:this.total_purchasings_canceled,
          total_purchasings_withTax:this.total_purchasings_withTax,

           // row 13
           total_vat_due_current_period: this.total_vat_due_current_period,
            // row 14
          corrections_previous_periods: this.corrections_previous_periods,
           // row 15
           vat_carried_forward_previous_periods: this.vat_carried_forward_previous_periods,
            // row 16
          net_vat_due_or_refunded: this.net_vat_due_or_refunded,

       // ============ End ofsales purchasing================
    }

    this.subs.add(this.http.postReq('api/dashboard/reports/tax-return',body).subscribe({
      next:res=>{
        this.report_id = res?.data?.tax_return_report?.id;
        if (this.language == 'en') {
          this.toastr.info('The report was successfully generated.');
        } else {
          this.toastr.info('تم إصدار التقرير بنجاح');
        }
        
        this.viewOnly = true;
        
      }})
    )
  }

getSingleReport(){
  this.subs.add(this.http.getReq(`api/dashboard/reports/${this.report_id}/show`).subscribe({
    next:res=>{ 
      this.fillFormData(res?.data?.tax_return_report);
    },
    complete:()=>{
      this.updateTaxValues();
    }
  }))
}
  download(url: string): Observable<Blob> {
    return this.httpClient.get(url, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  baseURL = environment.baseUrl;
  saveReport(){
    this.download_pdfService.downloadTaxReports(this.report_id)
    // let url = `${this.baseURL}api/dashboard/reports/generatePdf`
    // this.download(url).subscribe(blob => {
    //   const downloadURL = window.URL.createObjectURL(blob);
    //   const link = document.createElement('a');
    //   link.href = downloadURL;
    //   link.download = `tax.pdf`; // Set your file name
    //   link.click();
    //   window.URL.revokeObjectURL(downloadURL);
    //   });
  }

}
