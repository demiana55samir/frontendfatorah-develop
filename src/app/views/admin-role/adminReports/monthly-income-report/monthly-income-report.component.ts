import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { monthly_data } from '@modules/report';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { GeneralService } from '@services/general.service';
import { HttpService } from '@services/http.service';
import { Dropdown } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
const datePipe = new DatePipe('en-EG');


@Component({
  selector: 'app-monthly-income-report',
  templateUrl: './monthly-income-report.component.html',
  styleUrls: ['./monthly-income-report.component.scss']
})
export class MonthlyIncomeReportComponent implements OnInit {

  startDate!:any
  endDate!:any
  CardsData:monthly_data = {} as monthly_data;

  private subs= new Subscription()
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
  currentDuration = 1;
  language:any


  constructor(private http:HttpService,private changeLang:ChangeLanguageService,
    private generalService:GeneralService,
    private router:Router,private authService:AuthService) { }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage;
    this.getReport()
  }


  getReport(){
    // this.getDate(this.currentDuration)

    if(this.currentDuration >0 && this.currentDuration < 11){
      const { startDate, endDate } = this.generalService.getDate_admin(this.currentDuration);
      this.startDate = startDate;
      this.endDate = endDate;
    }

    this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
    this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');
    let params={
      'date_from':this.startDate,
      'date_to':this.endDate
    }
    this.subs.add(this.http.getReq('api/admin/reports/monthly/income',{params:params}).subscribe({
      next:res=>{
        this.CardsData=res.data;
      }
    })) 

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

}
