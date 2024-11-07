import { DatePipe } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { LooseObject } from '@modules/LooseObject';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { GeneralService } from '@services/general.service';
import { HttpService } from '@services/http.service';
import { NumberFormatPipe } from 'app/core/pipes/NumberFormat.pipe';

import { ChartComponent} from 'ng-apexcharts';
import { Dropdown } from 'primeng/dropdown';
import { Paginator } from 'primeng/paginator';
import { Subscription, switchMap } from 'rxjs';

const datePipe = new DatePipe('en-EG');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private subs= new Subscription()
  CardsData:any
  top_clients:any
  last_events:any
  paymentHistory:any
  name:any
  
  //charts doughnut
  plansChart:any
  chartOptions: any = {
    cutout: 70, // Adjust this value to change thickness
  };
  //chart bar
  plansStatisticsBarChart:any
  reportsStatisticsBarChart:any
  barchartOptions:any
  aboutToExpire:any
  expired:any
  //chart 
  chartInvoicesOptions:any
  chartSalesOptions:any
  receiptsOptions:any
  revenuesOptions:any
  usersOptions:any
  quotationsOptions:any


  cardTabs1=new Array(2).fill(false)
  cardTabs2=new Array(2).fill(false)
  cardTabs3=new Array(2).fill(false)
  cardTabs4=new Array(2).fill(false)
//subscriptions
  columnsArraySubscriptions:columnHeaders[]= [
    {
     nameAR: 'رقم العميل / الشركة',
     nameEN:'Client/Organization Id'

    },
    {
     nameAR: 'اسم العميل / الشركة',
     nameEN:'Client/Organization name'

    },
    { 
      nameAR:'الايميل',
      nameEN:'Email'

    },
    {
     nameAR: 'رقم الجوال',
     nameEN:'Phone Number'
    },
    {
     nameAR: 'خطة الاشتراك',
     nameEN:'Plan'
      
    },
    {
     nameAR: 'الدخول لحساب المستخدم',
     nameEN:'Log in to the user account'
      
    },
    {
     nameAR: 'يوم انتهاء الصلاحية',
     nameEN:'Expired at'
    },


   ]

   columnsNamesSubscriptions:ColumnValue[]= [
    {
      name:'id',
      type:'normal'
    },
    {
      name:'name',
      type:'blueAdminUser'
    },
    {
      name:'email',
      type:'normal'
    },
    {
      name:'phone',
      type:'normal'
    },
    {
      name:'plan',
      type:'normal'
    },
    {
      name:'uuid',
      type:'blue-login'
    },
    {
      name:'ends_at',
      type:'normal'
    },

   ]
  
   controlArraySubscriptions:ControlItem[]=[
    {
      nameAR:'عرض بيانات المستخدم',
      nameEN:'View Use Details',
      route:{
        path:'/admin/user-details/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:'تعديل بيانات المستخدم',
      nameEN:'Edit User Details',
      route:{
        path:'/admin/user-data/update/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:'حذف الإشتراك ',
      nameEN:'Delete Subscription',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'DeleteAdminSubscription'
    }

   ]

   //payment

   columnsArrayPayment:columnHeaders[]= [
    {
     nameAR: 'الايميل',
     nameEN:'Email'

    },
    {
     nameAR: 'نوع بطاقة الدفع',
     nameEN:'Payment card'

    },
    { 
      nameAR:'التاريخ',
      nameEN:'Date'

    },
    {
     nameAR: 'المبلغ',
     nameEN:'Amount'
    },
    {
     nameAR: 'الخصم',
     nameEN:'Discount'
      
    },
    {
     nameAR: 'الفاتورة',
     nameEN:'Invoice'
      
    },

   ]

   columnsNamesPayment:ColumnValue[]= [
    {
      name:'email',
      type:'normal'
    },
    {
      name:'card_band',
      type:'normal'
    },
    {
      name:'transfer_date',
      type:'normal'
    },
    {
      name:'amount',
      type:'normal'
    },
    {
      name:'discount',
      type:'normal'
    },
    {
      name:'',
      type:'downloadPayment'
    },

   ]
   controlArrayPayment:ControlItem[]=[]

   language:any
  
   Invoice_Reports = 'تقرير الفواتير';
   sales_Reports =' تقرير المبيعات';

   Receipts_Reports =' تقرير سندات القبض';
   revenues_Reports = 'تقرير الايرادات';
   users_Reports ='تقرير  المستخدمين';
   quotations_Reports =' تقرير  عروض الأسعار';

   todayDate:any = new Date();
   @ViewChild('paginator') paginator!: Paginator;
   @ViewChild("chart_Bar") chart_Bar!: ChartComponent;

   userRole = 'user'
   public chartOptionsII: any;
    public chartOptionsIII: any;
  constructor(private http: HttpService,private generalService:GeneralService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private ngZone: NgZone,
    private changelang:ChangeLanguageService) { 
      this.router.navigate([], { queryParams: {q:null,page:1}, queryParamsHandling: 'merge' })  
    }

  ngOnInit() {

    let user = this.authService.getUserObj();
    this.userRole = user.role
    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
          this.currentPage = Number(param['page']);
      }
        return this.getAllPaymentHistoryData(param);
      })
    ).subscribe({
      next:res=>{
        this.paymentHistory=res.data=res.data
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
      }
    }));
  
    this.chartOptionsII = {
      series: [{}],
      chart: {
        type: "bar",
        height: 350
      }
    };
    this.chartOptionsIII = {
      series: [{}],
      chart: {
        type: "bar",
        height: 350
      }
    };
    this.language=this.changelang.local_lenguage

     //charts
     this.plansChart = {
      datasets: [
          {
              data: [{}],
              
          }
      ],
      chart: {
        // todo 1
        type: "dount",
      }
  };

  //  this.plansStatisticsBarChart = {
  //     labels: [{}],
  //     responsive:true,
  //     datasets: [
  //         {
  //             backgroundColor: '#6759FF',
  //             data: [{}],
  //             barPercentage: 0.4,
  //             barThickness: 50,
  //             maxBarThickness: 70,
  //         },
  //     ],
  //     chart: {
  //       // todo 1
  //       type: "bar",
  //     }
      
  //   };
  //  this.reportsStatisticsBarChart = {
  //     labels: [{}],
  //     responsive:true,
  //     datasets: [
  //         {
  //             backgroundColor: '#6759FF',
  //             data: [{}],
  //             barPercentage: 0.4,
  //             barThickness: 50,
  //             maxBarThickness: 70,
  //             legend: {
  //               display: false 
  //             }
  //         },
  //     ],
  //     chart: {
  //       // todo 2
  //       type: "bar",
  //     }
      
  //   }
    this.barchartOptions = {
      datasets: [{}],
      chart: {
        // todo 1
        type: "bar",
      },
      responsive:true,
      plugins: {
        legend: {
            display: false,
           
        }
    }
    };

    this.chartInvoicesOptions = {
      series: [
        {
          name:  this.Invoice_Reports,
          data: [{}],
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      }
    };
    this.chartSalesOptions = {
      series: [
        {
          name:  this.sales_Reports,
          data: [{}],
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      }
    };
    this.receiptsOptions = {
      series: [
        {
          name:  this.sales_Reports,
          data: [{}],
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      }
    };
    this.revenuesOptions = {
      series: [
        {
          name:  this.sales_Reports,
          data: [{}],
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      }
    };
    this.usersOptions = {
      series: [
        {
          name:  this.sales_Reports,
          data: [{}],
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      }
    };
    this.quotationsOptions = {
      series: [
        {
          name:  this.sales_Reports,
          data: [{}],
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      }
    };

    
    // this.todayDate = this.datePipe.transform(this.todayDate, 'fullDate', '', 'ar')? this.datePipe.transform(this.todayDate, 'fullDate', '', this.language):new Date();
    this.cardTabs1[0]=true
    this.cardTabs2[0]=true
    this.cardTabs3[0]=true
    this.cardTabs4[0]=true
    // this.getPaymentHistoryData()
    this.getSubscriptionsData()
    this.getLastTransData()
   
    this.getCardData()
    this.getGeneralData()
    this.getPlansChartData()
    // this.getPlansStatisticsChartData()
    this.changeDate()
    // this.changeDateRevenues();
    
    this.profitsChartData();

    if(this.userRole == 'admin'){

      this.salesChartData();
      this.quotationsChartData();

      this.receiptsChartData();
      

      this.invoiceChartData();


      this.revenuesChartData();

      this.changeDateProfits();

      this.usersChartData();
    }
    

    if(this.language == 'en'){
      this.Invoice_Reports = 'Invoices report ';
      this.sales_Reports =' Sales report ';
      this.Receipts_Reports =' Receipts report';
      this.revenues_Reports = 'Revenues report';
      this.users_Reports ='Users report  ';
      this.quotations_Reports =' Quotations report ';

    }
   

  }

  getCardData(){
    this.subs.add(this.http.getReq('api/admin/index').subscribe({
      next:res=>{
       this.CardsData=res.data
       this.top_clients=res.data.top_users
      }
    }))
  }
  getSubscriptionsData(){
    this.subs.add(this.http.getReq('api/admin/ajax/subscriptions').subscribe({
      next:res=>{
       this.aboutToExpire=res.data
      }
    }))
    this.subs.add(this.http.getReq('api/admin/ajax/subscriptions/expired').subscribe({
      next:res=>{
       this.expired=res.data
      }
    }))
  }
  getLastTransData(){
    this.subs.add(this.http.getReq('api/admin/ajax/last/events').subscribe({
      next:res=>{
       this.last_events=res.data
      }
    }))
  }

  getAllPaymentHistoryData(filters : any){
    let x :LooseObject ={}; 
    for (const [key , value] of Object.entries(filters) ) {
      // console.log( key ,  value);
      if(value)
        x[key] = value
    }
    let getUrl = 'api/admin/ajax/payment/history';
   return this.http.getReq(getUrl,{params:x}); 
 }

  getPaymentHistoryData(){
    this.subs.add(this.http.getReq('api/admin/ajax/payment/history').subscribe({
      next:res=>{
       this.paymentHistory=res.data
      }
    }))
  }

  getGeneralData(){
    let generalData =  localStorage.getItem('UserObj');
    if(generalData){
      let userData = JSON.parse(generalData);
      this.name = userData?.name
 
    }else{
      this.subs.add(this.generalService.getGeneralData().subscribe({
        next:(res)=>{
          this.name = res?.data?.name
          localStorage.setItem('UserObj',JSON.stringify(res?.user))
        }
      }));
    }
    
   }

   //doughnut chart 

   plansData:any
   getPlansChartData(){
    this.subs.add(this.http.getReq('api/admin/ajax/subscriptions/summary').subscribe({
      next:res=>{
        this.plansData=res.data
      },
      complete:()=>{
        this.fillPlansChartData()
      }
   }))

   }

   getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

chartOptionsready = false;
   fillPlansChartData(){
    let labelsData:any = [];
    let plansDataPercentage:any=[]
    this.plansData.forEach((e:any)=>{
      plansDataPercentage.push(e.users)
      const planObject = JSON.parse(e.plan);
      if(this.language == 'en') labelsData.push(planObject.en)
      else labelsData.push(planObject.ar)
    })
  
    
    this.plansChart = {
      labels: labelsData,
      
      datasets: [
          {
              data:plansDataPercentage,

              // backgroundColor: [
              //   '#F4BE37',
              //   '#0D2535',
              //   '#5388D8',
              // ],
          }
      ]
  };

  // this.chartOptions={
  //   title: {
  //       display: true
  //   },
  //   layout: {
  //     padding: {
  //         left: 50
  //     }
  // },
  //   legend: {
  //       position: 'bottom'
  //   }
  // };
  
const dynamicColors = ['#5388D8','#f4be37','#11C387','#659D71','#2F9CEB','#FFA6AA','#0d2535','#8BC55D','#FF6B57','#B28DED','#06022B']

  this.chartOptions = {
    series: plansDataPercentage,
    chart: {
      type: "donut",
      width: 350,
      height:350,
      position: 'top',
      horizontalAlign: 'top',
    },
    colors: dynamicColors,
    labels:labelsData,
    legend: {
      width:300,
      show: true,
      position: "bottom",
      fontSize: "13px",
      fontWeight: 700,
      horizontalAlign: "center",
      offsetY: 0,
      markers:{
        offsetX: (this.language=='ar')? 5 : -5,
    },
    itemMargin: {
      horizontal: 15,
      vertical: 5
  },
  },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            width:200,
            show: true,
            position: "bottom",
            fontSize: "13px",
            fontWeight: 700,
            horizontalAlign: "center",
            offsetY: 0,
            markers:{
              offsetX:  (this.language=='ar')? 10 : -10,
          }
        }
        }
      }
    ]
  };

  this.chartOptionsready = true;
   }

   changeDate(){
    this.getDate(this.currentDuration)
    this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
    this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');

    this.getPlansStatisticsChartData()
  }
  changeDateProfits(){
    this.getDateI(this.currentDurationRevenues)
    this.startDateRevenues=datePipe.transform( this.startDateRevenues, 'yyyy-MM-dd');
    this.endDateRevenues=datePipe.transform( this.endDateRevenues, 'yyyy-MM-dd');

    this.profitsChartData();
  }

  
   plansStatisticsData:any
   getPlansStatisticsChartData(){
    let body = {
      date_from:this.startDate,
      date_to:this.endDate
    }
    this.subs.add(this.http.getReq('api/admin/ajax/subscriptions/status',{params:body}).subscribe({
      next:res=>{
        this.plansStatisticsData=res.data
      },
      complete:()=>{
        this.fillPlansStatisticsChartData()
      }
   }))

   }
   chartOptionsIIReady = false;
   fillPlansStatisticsChartData(){
    let plansDataPercentage:any=[]
    let plansDataName:any=[]
    let planData :{name:string,data:string}[] = []
    this.plansStatisticsData.forEach((e:any)=>{
      plansDataPercentage.push(e.count)
      plansDataName.push(e.name)
      // planData.push({name:e.name,data:e.count})
    })

    
    this.chartOptionsII = {
      series: [
        {
        data: plansDataPercentage,
        }] ,
      chart: {
        type: "bar",
        height: 350,
        events: {
          click: (event: any, chartContext: any, { seriesIndex, dataPointIndex, config }: any) => {
           
            
            if (dataPointIndex !== undefined && seriesIndex != -1) {
              // todo open user report
              // this.handleBarClick(seriesIndex, dataPointIndex, config);
            }
            // If dataPointIndex is undefined, but seriesIndex is -1, a category name was clicked
            // else if (event.target.classList.contains('apexcharts-xaxis-label')) {
            //   // Extract the category name from the clicked label
            //   let categoryName = event.target.textContent;
            //   // Call your function here, passing the category name
            //   this.handleCategoryLabelClick(categoryName);
            // }
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "20%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["#6759FF"]
      },
      xaxis: {
        categories: plansDataName
      },
      fill: {
        opacity: 1,
        colors: ['#6759FF']
      },
      tooltip: {
        y: {
          formatter: (val: string)=>{
            return  val + " thousands";
          }
        }
      },
      zoom: {
        enabled: true,
        type: 'x',
        resetIcon: {
            offsetX: -10,
            offsetY: 0,
            fillColor: '#fff',
            strokeColor: '#37474F'
        },
        selection: {
            background: '#90CAF9',
            border: '#0D47A1'
        }    
    },
      responsive: [
        {
          breakpoint: 480,
          options: {
            xaxis: {
              title: {
              align: 'center',
              offsetY: -90
            }
            }
          }
        }
      ]

    };
    this.chartOptionsIIReady = true;
   }

    handleBarClick(seriesIndex:number, dataPointIndex:number, config:any) {
    
      // let currentType =  this.plansStatisticsData[dataPointIndex].type;

      // let params = {
      //   page:1,
      //   date_from: this.startDate,
      //   date_to:this.endDate,
      //   // type:currentType
      // }

      // let paramsData = {
      //   currentDuration: this.currentDuration,
      //   // type:currentType
      // }

      // localStorage.setItem('subscriptionsReport',JSON.stringify(paramsData));
      // // { queryParams: params }
      // this.ngZone.run(() => {
      //   this.router.navigate(['/admin/Admin-Reports/users-report'], );
      // });
  
    }

    handleCategoryLabelClick(categoryName:string) {
      // Logic for what happens when a category label is clicked
      console.log(`Category label clicked: ${categoryName}`);
      // Call other component methods or perform actions as needed
    }

   revenuesData:any
   profitsData:any;
   revenuesChartData(){
    // let body = {
    //   date_from:this.startDateRevenues,
    //   date_to:this.endDateRevenues
    // }
    // ,{params:body}
    this.subs.add(this.http.getReq('api/admin/ajax/revenues/report').subscribe({
      next:res=>{
        this.revenuesData=res.data
      },
      complete:()=>{
        // this.fillRevenuesChartData()
        this.fillRevenuesChart2Data()
      }
   }))

   }


   profitsChartData(){
    let body = {
      date_from:this.startDateRevenues,
      date_to:this.endDateRevenues
    }

    this.subs.add(this.http.getReq('api/admin/ajax/subscriptions/profits',{params:body}).subscribe({
      next:res=>{
        this.profitsData=res.data
      },
      complete:()=>{
        this.fillRevenuesChartData()
        // this.fillRevenuesChart2Data()
      }
   }))

   }

   chartOptionsIIIReady = false;
   fillRevenuesChartData(){
    let plansDataPercentage:any=[]
    let plansDataName:any=[]
    this.profitsData.forEach((e:any)=>{
      
      plansDataPercentage.push(Math.floor(e.total))
      plansDataName.push(this.getMonthName(e.month,this.language))
    })

    this.chartOptionsIII = {
      series: [
        {
        data: plansDataPercentage,
        }] ,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["#6759FF"]
      },
      xaxis: {
        categories: plansDataName
      },
      fill: {
        opacity: 1,
        colors: ['#6759FF']
      },
      resposive:true,
      tooltip: {
        y: {
          formatter: (val: string)=>{
            return  val + " thousands";
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            xaxis: {
              title: {
              align: 'center',
              offsetY: -90
            }
            }
          }
        }
      ]
    };


    // this.reportsStatisticsBarChart = {
    //   labels: plansDataName,
    //   datasets: [
    //       {
    //           backgroundColor: '#6759FF',
    //           data:plansDataPercentage,
    //           barPercentage: 0.4,
    //           barThickness: 50,
    //           maxBarThickness: 70,
    //       },
    //   ]
      
    // };
    this.chartOptionsIIIReady = true;
   }

   revenuesOptionsReady = false;
   fillRevenuesChart2Data(){
    let revenues:any=[]
    let revenuesMonths:any=[]
    this.revenuesData.forEach((e:any)=>{
      revenues.push(e.count)
      revenuesMonths.push(this.getMonthName(e.month,this.language))
    })
    this.revenuesOptions= {
      series: [
        {
          name: this.revenues_Reports,
          data: revenues,
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,

        },

      },
      xaxis: {
        categories: revenuesMonths
      },
      resposive:true
    };
    this.revenuesOptionsReady = true;
   }
   invoiceData:any
   invoiceChartData(){
    this.subs.add(this.http.getReq('api/admin/ajax/invoices/report').subscribe({
      next:res=>{
        this.invoiceData=res.data
      },
      complete:()=>{
        this.fillInvoiceChartData()
      }
   }))

   }
   chartInvoicesOptionsReady = false;
   fillInvoiceChartData(){
    let Invoices:any=[]
    let InvoicesMonths:any=[]
    this.invoiceData.forEach((e:any)=>{
      Invoices.push(e.count)
      InvoicesMonths.push(this.getMonthName(e.month,this.language))
    })
    this.chartInvoicesOptions= {
      series: [
        {
          name:  this.Invoice_Reports,
          data: Invoices,
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,

        },

      },
      xaxis: {
        categories: InvoicesMonths
      },
      resposive:true
    };
    this.chartInvoicesOptionsReady = true;
   }
   salesData:any
   salesChartData(){
    this.subs.add(this.http.getReq('api/admin/ajax/sales/report').subscribe({
      next:res=>{
        this.salesData=res.data
      },
      complete:()=>{
        this.fillSalesChartData()
      }
   }))

   }
   chartSalesOptionsReady = false;
   fillSalesChartData(){
    let sales:any=[]
    let salesMonths:any=[]
    this.salesData.forEach((e:any)=>{
      sales.push(e.count)
      salesMonths.push(this.getMonthName(e.month,this.language))
    })
    this.chartSalesOptions= {
      series: [
        {
          name:  this.sales_Reports,
          data: sales,
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,

        },

      },
      xaxis: {
        categories: salesMonths
      },
      resposive:true
    };
    this.chartSalesOptionsReady = true;
   }
   receiptsData:any
   receiptsChartData(){
    this.subs.add(this.http.getReq('api/admin/ajax/receipts/report').subscribe({
      next:res=>{
        this.receiptsData=res.data
      },
      complete:()=>{
        this.fillreceiptsChartData()
      }
   }))

   }
   receiptsOptionsReady = false;
   fillreceiptsChartData(){
    let receipts:any=[]
    let receiptsMonths:any=[]
    this.receiptsData.forEach((e:any)=>{
      receipts.push(e.count)
      receiptsMonths.push(this.getMonthName(e.month,this.language))
    })
    this.receiptsOptions= {
      series: [
        {
          name: this.Receipts_Reports,
          data: receipts,
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,

        },

      },
      xaxis: {
        categories: receiptsMonths
      },
      resposive:true
    };
    this.receiptsOptionsReady = true;
   }
   usersData:any
   usersChartData(){
    this.subs.add(this.http.getReq('api/admin/ajax/users/report').subscribe({
      next:res=>{
        this.usersData=res.data
      },
      complete:()=>{
        this.fillusersChartData()
      }
   }))

   }

   usersOptionsReady = false;
   fillusersChartData(){
    let users:any=[]
    let usersMonths:any=[]
    this.usersData.forEach((e:any)=>{
      users.push(e.count)
      usersMonths.push(this.getMonthName(e.month,this.language))
    })
    this.usersOptions= {
      series: [
        {
          name: this.users_Reports,
          data: users,
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,

        },

      },
      xaxis: {
        categories: usersMonths
      },
      resposive:true
    };
    this.usersOptionsReady = true;
   } 
   quotationsData:any
   quotationsChartData(){
    //quotations
    this.subs.add(this.http.getReq('api/admin/ajax/quotations/report').subscribe({
      next:res=>{
        this.quotationsData=res.data
      },
      complete:()=>{
        this.fillquotationsChartData()
      }
   }))

   }

   quotationsOptionsReady = false;
   fillquotationsChartData(){
    let quotations:any=[]
    let quotationsMonths:any=[]
    this.quotationsData.forEach((e:any)=>{
      quotations.push(e.count)
      quotationsMonths.push(this.getMonthName(e.month,this.language))
    })
    this.quotationsOptions= {
      series: [
        {
          name: this.quotations_Reports,
          data: quotations,
        }
      ],
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,

        },

      },
      xaxis: {
        categories: quotationsMonths
      },
      resposive:true
    };
    this.quotationsOptionsReady = true;
   }

   
   changeTabs(index:number,card:number){
      if(card==1){
        this.cardTabs1.fill(false)
        this.cardTabs1[index]=true
      }
      else if (card==2){
        this.cardTabs2.fill(false)
        this.cardTabs2[index]=true
      }
      else if (card==3){
        this.cardTabs3.fill(false)
        this.cardTabs3[index]=true
      }
      else if (card==4){
        this.cardTabs4.fill(false)
        this.cardTabs4[index]=true
      }
   }


   getMonthName(month:string, language:'ar'|'en') {
    let monthNumber = Number(month)
    const monthNames = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    };

    // Check if the month number is valid
    if (monthNumber < 1 || monthNumber > 12) {
        return 'Invalid Month Number';
    }

    // Return the month name
    return monthNames[language][monthNumber - 1];
}

currentPage = 1
totalPage = 0
perPage = 0
onPageChange(e:any){

  this.currentPage = e.page + 1
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });

}


duration=[
  { nameAR: 'اليوم', nameEN: 'Today', value: 1 },
  { nameAR: 'البارحة', nameEN: 'Yesterday', value: 2 },
  { nameAR: 'آخر أسبوع', nameEN: 'Last Week', value: 3 },
  { nameAR: 'اخر 30 يوم', nameEN: 'Last 30 Days', value: 4 },
  { nameAR: 'هذا الشهر', nameEN: 'This Month', value: 5 },
  { nameAR: 'آخر شهر', nameEN: 'Last Month', value: 6 },
  { nameAR: 'آخر 3 شهور', nameEN: 'Last 3 Months', value: 7 },
  { nameAR: 'آخر 6 شهور', nameEN: 'Last 6 Months', value: 8 },
  { nameAR: 'آخر سنة', nameEN: 'Last Year', value: 9 },
  { nameAR: 'طوال المدة', nameEN: 'All Time', value: 10 },
  { nameAR: 'اختر تاريخ محدد', nameEN: 'Select Specific Date', value: 11 }
]
startDate!:any
endDate!:any
currentDuration:number = 1;

startDateRevenues!:any
endDateRevenues!:any
currentDurationRevenues:number = 1;


// type 
// 1 -> إحصائيات الباقات
// 2 -> تقرير الايرادات

getDate(duration_value:number ){
 

  if(duration_value==1){
    this.startDate=new Date();
    this.startDate.setHours(0, 0, 0, 0);

    this.endDate=new Date();
    this.endDate.setHours(23, 59, 59, 999);

  }
  else if(duration_value==2){
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.endDate.getDate() - 1);
    this.startDate.setHours(0, 0, 0, 0);

    this.endDate=new Date(this.startDate);
    this.endDate.setHours(23, 59, 59, 999);

  }
  else if(duration_value==3){
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.startDate.setHours(0, 0, 0, 0);

    this.endDate=new Date();
    this.endDate.setHours(23, 59, 59, 999);

  }
  else if(duration_value==4){
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 30);
    this.startDate.setHours(0, 0, 0, 0);

    this.endDate=new Date();
    this.endDate.setHours(23, 59, 59, 999);

  }
  else if(duration_value==5){
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 30);
    this.endDate = new Date();
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate=new Date(this.startDate);
    this.endDate.setHours(23, 59, 59, 999);

    const currentDate = new Date();
    this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
   const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
   this.endDate = new Date(nextMonthStart.getTime() - 1);

  }
  else if(duration_value==6){
    this.startDate = new Date();
    this.startDate.setMonth(this.startDate.getMonth() - 1);
    this.startDate.setDate(1);
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate = new Date(this.startDate);
    this.endDate.setMonth(this.endDate.getMonth() + 1);
    this.endDate.setDate(0);
    this.endDate.setHours(23, 59, 59, 999);

  }
  else if(duration_value==7){
    this.startDate = new Date();
    this.startDate.setMonth(this.startDate.getMonth() - 3);
    this.startDate.setDate(1);
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate = new Date(this.startDate);
    this.endDate.setMonth( this.endDate.getMonth() + 3);
    this.endDate.setDate(0);
    this.endDate.setHours(23, 59, 59, 999);

  }
  else if(duration_value==8){
    this.startDate = new Date();
    this.startDate.setMonth(this.startDate.getMonth() - 6);
    this.startDate.setDate(1);
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate = new Date(this.startDate);
    this.endDate.setMonth( this.endDate.getMonth() + 6);
    this.endDate.setDate(0);
    this.endDate.setHours(23, 59, 59, 999);

  }
  else if(duration_value==9){
    this.startDate = new Date();
    this.startDate.setFullYear(this.startDate.getFullYear() - 1);
    this.startDate.setMonth(0);
    this.startDate.setDate(1);
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate= new Date(this.startDate);
    this.endDate.setFullYear(this.endDate.getFullYear() + 1);
    this.endDate.setMonth(0);
    this.endDate.setDate(0);
    this.endDate.setHours(23, 59, 59, 999);

  }
  else if(duration_value==10){
    // let created_at=this.authService.getUserObj().created_at
    // this.startDate = new Date(created_at);
    this.startDate = '2020-04-14';
    this.endDate= new Date();
  }

}

getDateI(duration_value:number ){
 
 
  if(duration_value==1){
    this.startDateRevenues=new Date();
    this.startDateRevenues.setHours(0, 0, 0, 0);

   this.endDateRevenues=new Date();
   this.endDateRevenues.setHours(23, 59, 59, 999);

  }
  else if(duration_value==2){
    this.startDateRevenues = new Date();
   this.endDateRevenues = new Date();
    this.startDateRevenues.setDate(this.endDateRevenues.getDate() - 1);
    this.startDateRevenues.setHours(0, 0, 0, 0);

   this.endDateRevenues=new Date(this.startDateRevenues);
   this.endDateRevenues.setHours(23, 59, 59, 999);

  }
  else if(duration_value==3){
    this.startDateRevenues = new Date();
   this.endDateRevenues = new Date();
    this.startDateRevenues.setDate(this.startDateRevenues.getDate() - 7);
    this.startDateRevenues.setHours(0, 0, 0, 0);

   this.endDateRevenues=new Date();
   this.endDateRevenues.setHours(23, 59, 59, 999);

  }
  else if(duration_value==4){
    this.startDateRevenues = new Date();
   this.endDateRevenues = new Date();
    this.startDateRevenues.setDate(this.startDateRevenues.getDate() - 30);
    this.startDateRevenues.setHours(0, 0, 0, 0);

   this.endDateRevenues=new Date();
   this.endDateRevenues.setHours(23, 59, 59, 999);

  }
  else if(duration_value==5){
    this.startDateRevenues = new Date();
    this.startDateRevenues.setDate(this.startDateRevenues.getDate() - 30);
   this.endDateRevenues = new Date();
    this.startDateRevenues.setHours(0, 0, 0, 0);
   this.endDateRevenues=new Date(this.startDateRevenues);
   this.endDateRevenues.setHours(23, 59, 59, 999);

    const currentDate = new Date();
    this.startDateRevenues = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
   const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  this.endDateRevenues = new Date(nextMonthStart.getTime() - 1);

  }
  else if(duration_value==6){
    this.startDateRevenues = new Date();
    this.startDateRevenues.setMonth(this.startDateRevenues.getMonth() - 1);
    this.startDateRevenues.setDate(1);
    this.startDateRevenues.setHours(0, 0, 0, 0);
   this.endDateRevenues = new Date(this.startDateRevenues);
   this.endDateRevenues.setMonth(this.endDateRevenues.getMonth() + 1);
   this.endDateRevenues.setDate(0);
   this.endDateRevenues.setHours(23, 59, 59, 999);

  }
  else if(duration_value==7){
    this.startDateRevenues = new Date();
    this.startDateRevenues.setMonth(this.startDateRevenues.getMonth() - 3);
    this.startDateRevenues.setDate(1);
    this.startDateRevenues.setHours(0, 0, 0, 0);
   this.endDateRevenues = new Date(this.startDateRevenues);
   this.endDateRevenues.setMonth(this.endDateRevenues.getMonth() + 3);
   this.endDateRevenues.setDate(0);
   this.endDateRevenues.setHours(23, 59, 59, 999);

  }
  else if(duration_value==8){
    this.startDateRevenues = new Date();
    this.startDateRevenues.setMonth(this.startDateRevenues.getMonth() - 6);
    this.startDateRevenues.setDate(1);
    this.startDateRevenues.setHours(0, 0, 0, 0);
   this.endDateRevenues = new Date(this.startDateRevenues);
   this.endDateRevenues.setMonth(this.endDateRevenues.getMonth() + 6);
   this.endDateRevenues.setDate(0);
   this.endDateRevenues.setHours(23, 59, 59, 999);

  }
  else if(duration_value==9){
    this.startDateRevenues = new Date();
    this.startDateRevenues.setFullYear(this.startDateRevenues.getFullYear() - 1);
    this.startDateRevenues.setMonth(0);
    this.startDateRevenues.setDate(1);
    this.startDateRevenues.setHours(0, 0, 0, 0);
   this.endDateRevenues= new Date(this.startDateRevenues);
   this.endDateRevenues.setFullYear(this.endDateRevenues.getFullYear() + 1);
   this.endDateRevenues.setMonth(0);
   this.endDateRevenues.setDate(0);
   this.endDateRevenues.setHours(23, 59, 59, 999);

  }
  else if(duration_value==10){
    // let created_at=this.authService.getUserObj().created_at
    // this.startDateRevenues = new Date(created_at);
    this.startDateRevenues = '2020-04-14';
   this.endDateRevenues= new Date();
  }

}


handleDate(date:Date,type:number){
  // type = 1 -> start
  // type = 2 -> end
  if(type ==  1){
    this.startDate =  datePipe.transform( date, 'yyyy-MM-dd');
  }else if(type == 2){
    this.endDate =  datePipe.transform( date, 'yyyy-MM-dd');
  }
  
}

handleDateI(date:Date,type:number){
  // type = 1 -> start
  // type = 2 -> end
  // alert(date + '=' +type)
  if(type ==  1){
    this.startDateRevenues =  datePipe.transform( date, 'yyyy-MM-dd');
  }else if(type == 2){
    this.endDateRevenues =  datePipe.transform( date, 'yyyy-MM-dd');
  }
  
}

@ViewChild('calendarModel') calendarModel!: ElementRef<HTMLElement>;

openCalenderModel(){
  let el: HTMLElement = this.calendarModel.nativeElement;
  el.click();
}
@ViewChild('durationDropDown') private durationDropDown!: Dropdown;

openModelCheck(){
  if (!this.durationDropDown.overlayVisible){
    if(this.currentDuration==11){
      this.openCalenderModel()

    }

  }
}


@ViewChild('calendarModelI') calendarModelI!: ElementRef<HTMLElement>;

openCalenderModelI(){
  let el: HTMLElement = this.calendarModelI.nativeElement;
  el.click();
}
@ViewChild('durationDropDownI') private durationDropDownI!: Dropdown;

openModelCheckI(){
  if (!this.durationDropDownI.overlayVisible){
    if(this.currentDurationRevenues==11){
      this.openCalenderModelI()

    }

  }
}
}
