import { Component, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { cardData, cardData1, features } from '@models/landing';
import { subscription_plans } from '@modules/subscription-plans';
import { RecaptchaService } from '@services/Recaptcha.service';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

interface SiteSettings  {
    site_name: string,
    keywords: string,
    description: string,
    webiste_name:string,
    facebook: string,
    whatsapp: string,
    twitter: string
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  monthly:boolean=true
  items:cardData[]=[
    {
      titleAR:'سهولة التعامل',
      titleEN:'Easy to use',
      bodyAR:'بإمكان المستخدم تسجيل حسابه وإدارة فواتيره بسهولة ويسر من خلال لوحة تحكم خاصة به.',
      bodyEN:"The user can create new account and activate it, Then manage his invoices easily through his own control panel.",
      image:'../../../../../assets/images/landing/img3.png',
      icon:''
    },
    {
      titleAR:'سرعة الوصول',
      titleEN:'Fast access',
      bodyAR:'بالإمكان إدارة فواتير عملائك ومنتجاتك في صفحة واحدة من خلال لوحة تحكم احترافية.',
      bodyEN:"You can manage the invoices of your customers and products on a professional control panel.",
      image:'../../../../../assets/images/landing/img2.png'
    },
    {
      titleAR:'إحصائيات عامة',
      titleEN:'General statistics',
      bodyAR:'يقدم لك فاتورة برو إحصائيات عن الفواتير والمنتجات والعملاء وحجم مبيعاتك خلال الأشهر.',
      bodyEN:"Fatorah Pro provides a statistics on your invoices, products, customers, and your sales during the months.",
      image:'../../../../../assets/images/landing/img1.png'
    },
    {
      titleAR:'فواتير أونلاين',
      titleEN:'Online Invoices',
      bodyAR:'يمكِّنك فاتورة برو الحصول على تصميم فواتير مثالي، وطباعتها أو إرسالها لعملائك مباشرة ويغنيك عن الفواتير الورقية.',
      bodyEN:"Fatorah Pro enables you to get a perfect design of invoices, print or send them to your customers directly, without papers.",
      image:'../../../../../assets/images/landing/img6.png'
    },
    {
      titleAR:'الأمان العالي',
      titleEN:'High secure',
      bodyAR:'فاتورة برو يقدم خدمة إدارة الفواتير على مستوى عالي من الأمن والحماية، معلوماتك وفواتيرك في سرية تامة.',
      bodyEN:"Fatorah Pro service provides a high security and protection, Your information and invoices are confidential.",
      image:'../../../../../assets/images/landing/img5.png'
    },
    {
      titleAR:'تعدد اللغات',
      titleEN:'Multi languages',
      bodyAR:'يتيج فاتورة برو تعدد اللغات في الموقع، و بإمكانك إنشاء فواتير لعملائك باللغتين العربية والإنجليزية.',
      bodyEN:"Fatorah Pro is multi language, you can create invoices for your customers in both Arabic and English Language.",
      image:'../../../../../assets/images/landing/img4.png'
    }
  ]

  items1:cardData1[] =[
    {
      number:6298,
      bodyAR:'عدد المستخدمين',
      bodyEN:'Users',
      image:'../../../../../assets/images/landing/cardImg1.png'
    },
    {
      number:26795,
      bodyAR:'عدد الفواتير',
      bodyEN:'Invoices',
      image:'../../../../../assets/images/landing/cardImg2.png'
    },
    {
      number:25309,
      bodyAR:'عدد المنتجات',
      bodyEN:'Products',
      image:'../../../../../assets/images/landing/cardImg3.png'
    }
  ]

cardOneData:string[]=[]
cardTwoData:string[]=[]
cardThreeData:string[]=[]
contactUsForm!:FormGroup
private subs=new Subscription()
// subscriptionPlanes= new Array(3)
language:any ;

subscriptionPlanes:subscription_plans[] = []

customOptions: OwlOptions = {

  loop: false,
  nav: true,
  navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'], // Left and Right arrow icons
  items: 1,
  dots: false,
  autoplay: false,
  margin:25,
  responsive: {
    0: {
      items: 1,
    },
    450: {
      items: 1,
    },
    675: {
      items: 1,
    },
    900:{
      items:3
    }
  },
};
owl = true;
@HostListener('window:resize', ['$event'])
onResize(event: Event): void {
  this.owl = false;
  setTimeout(() => {
    this.owl = true
    if(this.subscriptionPlanes.length > 8){
       this.customOptions.items = 8;
       this.customOptions.responsive= {
        0: {
          items: 1,
        },
        450: {
          items: 1,
        },
        675: {
          items: 1,
        },
        900:{
          items:6
        },
        1100:{
          items:8
        }
      }
      }
    else {
      this.customOptions.items = this.subscriptionPlanes.length;
      this.customOptions.responsive= {
        0: {
          items: 1,
        },
        450: {
          items: 1,
        },
        675: {
          items: 1,
        },
        900:{
          items:3
        },
        1100:{
          items:3
        }
      }}
  }, 200);
}

onTabChange(event: any, tabId: string): void {
  this.owl = false;
  this.subscriptionPlanes = [];
  setTimeout(() => {this.owl = true; },200)
}


  constructor(private router:Router,private auth:AuthService,private http:HttpService,private fb:FormBuilder,
    private toastr:ToastrService,private changelngServ:ChangeLanguageService,
    private recaptchaService: RecaptchaService) { }

  ngOnInit() {
    this.loadRecaptchaToken()
    this.language=this.changelngServ.local_lenguage
    if(this.language === 'en'){
      this.monthly=false
    }

    if(this.language === 'ar'){
      this.customOptions.rtl=true
    }
    else{
      this.customOptions.rtl=false
    }

    this.getDurations();
    this.getLandingData()
    this.contactUsForm=this.fb.group({
      name:['',Validators.required],
      email:['',Validators.compose([Validators.required,Validators.email])],
      subject:['',Validators.required],
      phone:['',Validators.required],
      message:['',Validators.required],
      recaptcha:['']
    })


  }
features:features[] =[]
invoiceNumber:number = 0
productCount:number =0;
usersCount:number =0;
siteSettings:SiteSettings = {} as SiteSettings;


  siteKey = 'https://www.google.com/recaptcha/api.js?render=6LfXLrMaAAAAADNZMFsZKtj-4TKjfxqgXITmvM5F';
  recaptchaResponse: string = '';

  recaptchaToken:string = '';

  private loadRecaptchaToken(): void {
    this.recaptchaService.execute('').then(token => {
      this.recaptchaToken = token;
      
    }).catch(error => {
      console.error('Error generating reCAPTCHA token', error);
    });
  }

  getLandingData(){
    this.subs.add(this.http.getReq('api/landing').subscribe({
      next:res=>{
      //  this.subscriptionPlanes=res.data.plans
       this.features=res.data.features
       this.invoiceNumber=res.data.invoices
       this.productCount=res.data.products_count
       this.usersCount=res.data.users
       this.siteSettings=res.data.settings

      //  this.subscriptionPlanes=this.mergePlansAndFeatures(res.data);

       localStorage.setItem('whatsapp',this.siteSettings.whatsapp)
       localStorage.setItem('facebook',this.siteSettings.facebook)
       localStorage.setItem('twitter',this.siteSettings.twitter)
       this.items1[0].number=this.usersCount
       this.items1[1].number=this.invoiceNumber
       this.items1[2].number=this.productCount
       this.features.forEach((element:features) => {
        if(element.plan_id==1){
          this.cardOneData.push(element.description)
        }
       else if(element.plan_id==2){
          this.cardTwoData.push( element.description )
        }
        else{
          this.cardThreeData.push(element.description )
        }
       });
      }
    }))
  }
  contactUs(){
    if (this.recaptchaToken) {
      if(this.contactUsForm.valid && this.contactUsForm.dirty){
        this.subs.add(this.http.postReq('api/contact_us',this.contactUsForm.value).subscribe({
          next:res=>{
    
          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Sended Successfully')
            }
            else{
              this.toastr.info('تم الإرسال بنجاح')
            }
             this.contactUsForm.reset()
          }
        }))
  
      } 
      else{
        this.contactUsForm.markAllAsTouched();
        if(this.language=='en'){
          this.toastr.error('please Enter All Required Fields')
        }
        else{
          this.toastr.error('الرجاء إدخال جميع الحقول المطلوبة ')
        }
      }
    }else{
      if(this.language=='en'){
        this.toastr.info('Please resolve the reCAPTCHA')
      }
      else{
        this.toastr.info('الرجاء حل اختبار reCAPTCHA')
      }
    }
    
  }
  navigateToDashbourd(){
    let user = this.auth.getUser();
    console.log(user);
    let isUser = user.role == 'user'? true : false;
  
    if(isUser){
      if(this.auth.isUserAuth()){
        this.router.navigate(['user/control/dashboard'])
      }
      else{
        this.router.navigate(['/auth/register-step1'])
      }
    }else{
      this.router.navigate(['/admin/control/dashboard'])
    }
  
  }
  checkAuth(plan_id:number){
    if(this.auth.isUserAuth()){

    }
    else{
      localStorage.setItem('selectedSubscription_id',plan_id.toString())
      this.router.navigate(['/auth/register-step1'])
    }
  }


  mergePlansAndFeatures(apiResponse: any): subscription_plans[] {
    const { plans, features } = apiResponse;
  
    const subscriptionPlans: subscription_plans[] = plans.map((plan:any) => {
      const planFeatures: features[] = features.filter((feature:features) =>
      feature.plan_id==plan.id
      );
    //  alert(plan.id)
      return {
        id: plan?.id,
        name: plan?.name,
        description: plan?.description,
        price: plan?.price,
        currency:plan?.currency,
        yearly_price: plan?.yearly_price,
        monthly_full_price: plan?.monthly_full_price,
        yearly_full_price: plan?.yearly_full_price,
        features: planFeatures,
        plan_duration:plan?.durations?.name
      };
    });
  
    return subscriptionPlans;
  }

  NewmergePlansAndFeatures(plans:subscription_plans[], features:any): subscription_plans[] {

    const subscriptionPlans: subscription_plans[] = plans.map((plan:any) => {
      const planFeatures: features[] = features.filter((feature:features) =>
      feature.plan_id==plan.id
      );
    //  alert(plan.id)
      return {
        id: plan?.id,
        name: plan?.name,
        description: plan?.description,
        price: plan?.price,
        full_price:plan?.full_price,
        currency:plan?.currency,
        yearly_price: plan?.yearly_price,
        monthly_full_price: plan?.monthly_full_price,
        yearly_full_price: plan?.yearly_full_price,
        durations:plan?.durations,
        features: planFeatures,
        plan_duration:plan?.durations?.name
      };
    });
  
    return subscriptionPlans;
  }
  durations:any = [];
  filteredDurations:any = [];
  getDurations(){
    this.subs.add(this.http.getReq('api/landing/durations').subscribe({
      next:res=>{
        this.durations=res.data
        this.filteredDurations = this.durations.filter((duration: any) => duration.plans_count > 0);
      },
      complete:()=>{
        if(this.filteredDurations.length > 0){
          this.currentDuration = this.filteredDurations[0].id;
        }

        this.getPlansByDuration(this.currentDuration);
      }
    }))
  }
  currentDuration = -1;
  chooseDurationFilter(durationId:number){
    this.currentDuration = durationId;
    this.getPlansByDuration(this.currentDuration);
  }

  getPlansByDuration(durationId:number){
    let param={
      duration_id:durationId
    }
    // api/landing/landingPlans?duration_id=1
    this.subs.add(this.http.getReq(`api/landing/landingPlans`,{params:param}).subscribe({
      next:res=>{
        this.subscriptionPlanes=this.NewmergePlansAndFeatures(res.packages,this.features);
        console.log(this.subscriptionPlanes);
        
      }
    }))
  }
}
