import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { GeneralService } from '@services/general.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Dropdown } from 'primeng/dropdown';
import { MultiSelect } from 'primeng/multiselect';
import { Subscription } from 'rxjs';

const datePipe = new DatePipe('en-EG');

@Component({
  selector: 'app-send-whatsapp',
  templateUrl: './send-whatsapp.component.html',
  styleUrls: ['./send-whatsapp.component.scss']
})
export class SendWhatsappComponent implements OnInit {

  
  clientTypes:any;
  clients:any;
  processedClients: any= [];
  selectedclients:any;
  MessageContent:any;

  emailDataForm!:FormGroup;
  private subs = new Subscription();
  language:any;


  joiningStartDate!:any
  joiningEndDate!:any

  expiredStartDate!:any
  expiredEndDate!:any

  subscriptionStartDate!:any
  subscriptionEndDate!:any

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
  currentJoiningDuration = -1;
  currentExpiredDuration = -1;
  currentsubscriptionDuration = -1;


  userList = [
    {
      name:'MESSAGES.ALLCLIENTS',
      val:'all'
    },
    {
      name:'MESSAGES.NEWCLIENTS',
      val:'new'
    },
    {
      name:'MESSAGES.INACTIVECLIENTS',
      val:'inactive'
    },
    {
      name:'MESSAGES.SUBCLIENTS',
      val:'subscription'
    },
    {
      name:'MESSAGES.EXPIREDSUBSCLIENTS',
      val:'expired'
    },
    {
      name:'MESSAGES.ACTIVECLIENTS',
      val:'active'
    },
    {
      name:'MESSAGES.CHOOSECLIENTSMANUALLY',
      val:'users_manually'
    }
   
  ];
  issuingInvoiceList = [
    {
      name:'MESSAGES.HASISSUINGINVOICES',
      val:'issued'
    },
    {
      name:'MESSAGES.HASNOTISSUINGINVOICES',
      val:'not_issued'
    },
    {
      name:'MESSAGES.ALL',
      val:'all'
    },
  ];
  translatedUserList:any = [];
  PlansList:any;

  @ViewChild('multiSelect') multiSelect!: MultiSelect;
  constructor(private fb:FormBuilder,
    private http:HttpService,
    private changelang:ChangeLanguageService,
    private translate: TranslateService,
    private toastr:ToastrService,
    private generalService:GeneralService,
  ) { }

  ngOnInit() {
    this.getAllClients();
    this.language=this.changelang.local_lenguage
    this.emailDataForm=this.fb.group({
      users :['',Validators.required],
     
      plan_ids:[null],
      expiry_date_from :[null],
      expiry_date_to :[null],

      subscription_date_from :[null],
      subscription_date_to :[null],
     
      join_date_from:[null],
      join_date_to:[null],

      user_invoices:[null],
      user_ids:[null],
      message: ['',Validators.required],
    })
    this.translateUserList();
    this.translateissuingInvoiceList();
    this.getUserPlans();

    
  }
  choosePlan(e:any){
    console.log(e);
    let planIds = e.value;
    let AllIndex = planIds.findIndex((x:number) => x == 0)
    if(AllIndex > -1) planIds.splice(AllIndex,1);

    if(planIds && planIds.length == this.PlansList.length){
      planIds.push(0)
      this.emailDataForm.controls['plan_ids'].setValue(planIds);
    }
    console.log(planIds);
  }
  getAllClients(){
    this.http.getReq('api/admin/get/users').subscribe({ 
      next:res=>{
        this.clients=res.data;
      }
    })
  }
  fillClientsData(index:number , currentLength:number){
    let usersLength = this.clients.length;
    if(currentLength > usersLength){
      return;
    }
    // setTimeout(() => {
      const chunk = this.clients.slice(index, currentLength);
      this.processedClients = [...this.processedClients, ...chunk];
      index += 50;
      currentLength += 50;
    // }, 1000);
      
    setTimeout(() => {
      this.fillClientsData(index,currentLength)
    }, 200);
  }

  processArrayInChunks(array: any[], chunkSize: number) {
    let index = 0;
    
    const processChunk = () => {
      const chunk = array.slice(index, index + chunkSize);
      this.processedClients = [...this.processedClients, ...chunk];
      index += chunkSize;

      if (index < array.length) {
        // Use setTimeout to avoid blocking the main thread
        setTimeout(processChunk, 0); 
      }
    };

    processChunk();
  }


  checkUser(e:any){
    if(e.value == 'expired') {
      this.applyExpiredDuration();
      this.emailDataForm.controls['subscription_date_from'].setValue(null);
      this.emailDataForm.controls['subscription_date_to'].setValue(null);
      this.emailDataForm.controls['user_ids'].setValue(null);
      this.emailDataForm.controls['user_ids'].removeValidators(Validators.required);
    }
    else if(e.value == 'users_manually'){
      this.emailDataForm.controls['user_ids'].addValidators(Validators.required);

      this.emailDataForm.controls['expiry_date_from'].setValue(null);
      this.emailDataForm.controls['expiry_date_to'].setValue(null);
      this.emailDataForm.controls['subscription_date_from'].setValue(null);
      this.emailDataForm.controls['subscription_date_to'].setValue(null);
      this.emailDataForm.controls['user_invoices'].setValue(null);
      this.emailDataForm.controls['join_date_from'].setValue(null);
      this.emailDataForm.controls['join_date_to'].setValue(null);
      this.emailDataForm.controls['plan_ids'].setValue(null);
    }
    else if(e.value == 'active') {
      this.applySubDuration();
      this.emailDataForm.controls['expiry_date_from'].setValue(null);
      this.emailDataForm.controls['expiry_date_to'].setValue(null);
      this.emailDataForm.controls['user_ids'].setValue(null);
      this.emailDataForm.controls['user_ids'].removeValidators(Validators.required);
    }else{
      this.emailDataForm.controls['subscription_date_from'].setValue(null);
      this.emailDataForm.controls['subscription_date_to'].setValue(null);
      this.emailDataForm.controls['expiry_date_from'].setValue(null);
      this.emailDataForm.controls['expiry_date_to'].setValue(null);
      this.emailDataForm.controls['plan_ids'].setValue(null);
      this.emailDataForm.controls['user_ids'].setValue(null);
      this.emailDataForm.controls['user_ids'].removeValidators(Validators.required);
    }
  }

  translateUserList() {
    this.translatedUserList = this.userList.map(item => ({
      ...item,
      name: this.translate.instant(item.name)
    }));
  }
  translateissuingInvoiceList() {
    this.issuingInvoiceList = this.issuingInvoiceList.map(item => ({
      ...item,
      name: this.translate.instant(item.name)
    }));
  }

  // type 1-> joining , 2-> expired , 3-> subscription
  fillDurationControls(type:number){
    if(type == 1){
      this.joiningStartDate=datePipe.transform( this.joiningStartDate, 'yyyy-MM-dd');
      this.joiningEndDate=datePipe.transform( this.joiningEndDate, 'yyyy-MM-dd');

      this.emailDataForm.controls['join_date_from'].setValue(this.joiningStartDate);
      this.emailDataForm.controls['join_date_to'].setValue(this.joiningEndDate);
    }
    else if(type == 2){
      this.expiredStartDate=datePipe.transform( this.expiredStartDate, 'yyyy-MM-dd');
      this.expiredEndDate=datePipe.transform( this.expiredEndDate, 'yyyy-MM-dd');

      this.emailDataForm.controls['expiry_date_from'].setValue(this.expiredStartDate);
      this.emailDataForm.controls['expiry_date_to'].setValue(this.expiredEndDate);
    }
    else if(type == 3){
      this.subscriptionStartDate=datePipe.transform( this.subscriptionStartDate, 'yyyy-MM-dd');
      this.subscriptionEndDate=datePipe.transform( this.subscriptionEndDate, 'yyyy-MM-dd');

      this.emailDataForm.controls['subscription_date_from'].setValue(this.subscriptionStartDate);
      this.emailDataForm.controls['subscription_date_to'].setValue(this.subscriptionEndDate);
    }
  }
  applyJoiningDuration(){
  
    if(this.currentJoiningDuration >0 && this.currentJoiningDuration < 11){
      const { startDate, endDate } = this.generalService.getDate_admin(this.currentJoiningDuration);
      this.joiningStartDate = startDate;
      this.joiningEndDate = endDate;

      this.fillDurationControls(1);
    }
  }

  applyExpiredDuration(){
    if(this.currentExpiredDuration >0 && this.currentExpiredDuration < 11){
      const { startDate, endDate } = this.generalService.getDate_admin(this.currentExpiredDuration);
      this.expiredStartDate = startDate;
      this.expiredEndDate = endDate;

      this.fillDurationControls(2);
    }
  }
  applySubDuration(){
    if(this.currentsubscriptionDuration >0 && this.currentsubscriptionDuration < 11){
      const { startDate, endDate } = this.generalService.getDate_admin(this.currentsubscriptionDuration);
      this.subscriptionStartDate = startDate;
      this.subscriptionEndDate = endDate;

      this.fillDurationControls(3);
    }
  }

  getUserPlans(){
    let param = {
      duration:true
    }
    this.subs.add(this.http.getReq(`api/admin/plans`,{params:param}).subscribe({
      next:res=>{
        this.PlansList = res.data;
        if(this.PlansList)
        this.PlansList = this.PlansList.filter((item:any) => item.price > 0);
    },
  }))
  }
  removeNullValues(obj: any): any {
    const cleanedObj:any = {};
    for (const key in obj) {
      if (obj[key] !== null) {
        cleanedObj[key] = obj[key];
      }
    }
    return cleanedObj;
  }

  
  addEmail(){

    if(this.MessageContent && this.MessageContent.length > 0){
      this.emailDataForm.controls['message'].setValue(this.MessageContent);
    }
    const nonNullableValues = this.removeNullValues(this.emailDataForm.value);
    // console.log(nonNullableValues);
    
    console.log(this.emailDataForm);
    
    if(this.emailDataForm.valid && this.emailDataForm.dirty){
     
      this.subs.add(this.http.postReq('api/admin/send/messages',nonNullableValues).subscribe({
        next:res=>{
    
        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Message sent successfully')
          }
          else{
            this.toastr.info('تم إرسال الرسالة بنجاح.')
          }
        }
       }))
    }else{
      this.emailDataForm.markAllAsTouched();
      if(this.language=='en'){
        this.toastr.error('please Enter All Required fields')
      }
      else{
        this.toastr.error('الرجاء إدخال جميع القيم المطلوبة ')
      }
    }
  }

  @ViewChild('durationDropDown') private durationDropDown!: Dropdown;
  openModelCheck(){
    if (!this.durationDropDown.overlayVisible){
      if(this.currentJoiningDuration==11){
        this.openCalenderModel()
      }
    }
  }
  @ViewChild('calendarModel') calendarModel!: ElementRef<HTMLElement>;
  openCalenderModel(){
    let el: HTMLElement = this.calendarModel.nativeElement;
    el.click();
  }


  @ViewChild('durationDropDownI') private durationDropDownI!: Dropdown;
  openModelCheckI(){
    if (!this.durationDropDownI.overlayVisible){
      if(this.currentExpiredDuration==11){
        this.openCalenderModelI()
      }
    }
  }
  @ViewChild('calendarModelI') calendarModelI!: ElementRef<HTMLElement>;
  openCalenderModelI(){
    let el: HTMLElement = this.calendarModelI.nativeElement;
    el.click();
  }

  @ViewChild('durationDropDownII') private durationDropDownII!: Dropdown;
  openModelCheckII(){
    if (!this.durationDropDownII.overlayVisible){
      if(this.currentsubscriptionDuration==11){
        this.openCalenderModelII()
      }
    }
  }
  @ViewChild('calendarModelII') calendarModelII!: ElementRef<HTMLElement>;
  openCalenderModelII(){
    let el: HTMLElement = this.calendarModelII.nativeElement;
    el.click();
  }


}
