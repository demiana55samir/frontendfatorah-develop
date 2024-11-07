import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router , Event, NavigationEnd} from '@angular/router';
import { permission } from '@modules/permissions';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { GeneralService } from '@services/general.service';
import { GeneralUserDataService } from '@services/generalUserData.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sideNavbar',
  templateUrl: './sideNavbar.component.html',
  styleUrls: ['./sideNavbar.component.scss']
})
export class SideNavbarComponent implements OnInit {
  activeURL = ''
  activeControl:boolean=false
  activeInvoices:boolean=false
  activePurchases:boolean=false
  activeSettings:boolean=false
  activeUser:boolean=false
  activeSupplier:boolean = false
  activeProducts:boolean=false
  activePrices:boolean=false
  activeReports:boolean=false
  activeReceiptv:boolean=false
  activeAllPaymentLinks:boolean=false
  activeSubscription:boolean = false;

  activeBalanceTransferRequest:boolean=false
  activeAdminUser:boolean=false
  activeAdminRoles:boolean=false
  activeAdminCoupons:boolean=false
  activeAdminSubscriptionPlans:boolean=false
  activeAdminSales:boolean=false
  activeAdminPaymentlinks:boolean=false
  activeRevenues:boolean=false
  activeAdminBlogs:boolean=false
  activeAdminMessages:boolean=false
  activeAdminTemplates:boolean=false
  activeAdminSettings:boolean=false
  activeAdminReports:boolean=false
  dashboredColor:any
  language:any

  showSideNav = true;
  isMobile = false;
  permissions:permission = {} as permission;
  active_purchase:Boolean = false;
  private subs=new Subscription();

  constructor(private router: Router,private changeLang:ChangeLanguageService,
    private authService: AuthService,
    private generalService:GeneralService) {
      this.checkScreenSize();
     
     }


  checkScreenSize() {
    this.isMobile = window.innerWidth <= 1024; // or any other size you consider as mobile
  }

  closeSideNav(){
    if(this.isMobile){
      var offcanvasScrolling = document.getElementById('offcanvasScrolling');
      offcanvasScrolling?.classList.remove('show');
    }
  }
  ngOnInit() {

    this.authService.UserObsrv$.subscribe({
      next: (res: any) => {
  
        let userInfoString = localStorage.getItem('UserObj')

        if (res) {
          let userData = res;
          localStorage.setItem('UserObj', JSON.stringify(userData));

          this.name = userData?.name
          this.email = userData?.email
          this.active_purchase = userData?.active_purchase
          this.profileImage = userData?.media?.avatar
          this.role=userData?.role;
          if(!userData?.permissions){
            this.authService.signOut()
          }else{
            this.permissions = userData?.permissions;
          }
          
                
        } else if (userInfoString) {
          let userData = JSON.parse(userInfoString);

          this.name = userData?.name
          this.email = userData?.email
          this.active_purchase = userData?.active_purchase;
          this.profileImage = userData?.media?.avatar
          this.role=userData?.role;
          if(!userData?.permissions){
            this.authService.signOut()
          }else{
          this.permissions = userData?.permissions;
          }

        }
      }
    })

    setTimeout(() => {
      var offcanvasScrolling = document.getElementById('offcanvasScrolling');
      if(window.innerWidth > 1024){
        offcanvasScrolling?.classList.add('show');
      }else{
        offcanvasScrolling?.classList.remove('show');
      }
    }, 200);
    this.getGeneralData()
    this.language=this.changeLang.local_lenguage
    if(localStorage.getItem('dashboardColor')){
      this.dashboredColor=localStorage.getItem('dashboardColor')
      document.documentElement.style.setProperty('--dashboredColor',this.dashboredColor);
      document.documentElement.style.setProperty('--whiteText','#ffff');

    }
    var offcanvasScrolling = document.getElementById('offcanvasScrolling');
    

    this.activeURL = this.router.url
    if(this.role=='user'){
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {

          this.activeURL = event.url
          if (this.activeURL.includes('/control')) {
            this.activeControl = true
            this.activeInvoices=false
            this.activePurchases=false
            this.activeSettings=false
            this.activeUser=false
            this.activeSupplier = false
            this.activeProducts=false
            this.activePrices=false
            this.activeReports=false
            this.activeReceiptv=false
            this.activeAllPaymentLinks=false
            this.activeBalanceTransferRequest=false
            this.activeSubscription = false
            this.closeAllAccordion(5)
          }
         else if (this.activeURL.includes('/All-receipt-voucher')) {
            this.activeReceiptv = true
            this.activeControl = false
            this.activeInvoices=false
            this.activePurchases=false
            this.activeSettings=false
            this.activeUser=false
            this.activeSupplier = false
            this.activeProducts=false
            this.activePrices=false
            this.activeReports=false
            this.activeAllPaymentLinks=false
            this.activeBalanceTransferRequest=false
            this.activeSubscription = false
          }
  
         else if (this.activeURL.includes('/purchases')) {
            this.activePurchases = true
            this.activeReceiptv = false
            this.activeControl = false
            this.activeInvoices=false
            this.activeSettings=false
            this.activeUser=false
            this.activeSupplier = false
            this.activeProducts=false
            this.activePrices=false
            this.activeReports=false
            this.activeAllPaymentLinks=false
            this.activeBalanceTransferRequest=false
            this.activeSubscription = false
          }
  
         else if (this.activeURL.includes('/users')&& !this.activeURL.includes('/user-profile') && !this.activeURL.includes('/suppliers-list')) {
            this.activeUser = true
            this.activePurchases = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeInvoices=false
            this.activeSettings=false
            this.activeProducts=false
            this.activeSupplier = false
            this.activePrices=false
            this.activeReports=false
            this.activeAllPaymentLinks=false
            this.activeBalanceTransferRequest=false
            this.activeSubscription = false
            this.closeAllAccordion(5)
          }

          else if (this.activeURL.includes('/suppliers-list')) {
            this.activeSupplier = true;
            this.activeUser = false
            this.activePurchases = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeInvoices=false
            this.activeSettings=false
            this.activeProducts=false
            this.activePrices=false
            this.activeReports=false
            this.activeAllPaymentLinks=false
            this.activeBalanceTransferRequest=false
            this.activeSubscription = false
            this.closeAllAccordion(5)
          }

  
         else if (this.activeURL.includes('/products')) {
            this.activeProducts = true
            this.activeUser = false
            this.activePurchases = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeSupplier = false
            this.activeInvoices=false
            this.activeSettings=false
            this.activePrices=false
            this.activeReports=false
            this.activeAllPaymentLinks=false
            this.activeBalanceTransferRequest=false
            this.activeSubscription = false
            this.closeAllAccordion(5)
          }
         else if (this.activeURL.includes('/prices')) {
            this.activePrices = true
            this.activeProducts = false
            this.activeUser = false
            this.activePurchases = false
            this.activeSupplier = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeInvoices=false
            this.activeSettings=false
            this.activeReports=false
            this.activeAllPaymentLinks=false
            this.activeBalanceTransferRequest=false
            this.activeSubscription = false
            this.closeAllAccordion(5)
          }
  
         else if (this.activeURL.includes('/All-payment-links')) {
            this.activeAllPaymentLinks = true
            this.activePrices = false
            this.activeProducts = false
            this.activeUser = false
            this.activePurchases = false
            this.activeSupplier = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeInvoices=false
            this.activeSettings=false
            this.activeReports=false
            this.activeBalanceTransferRequest=false
            this.activeSubscription = false
            this.closeAllAccordion(5)
          }
         else if (this.activeURL.includes('/balance-transfer-request')) {
            this.activeBalanceTransferRequest = true
            this.activeAllPaymentLinks = false
            this.activePrices = false
            this.activeProducts = false
            this.activeUser = false
            this.activePurchases = false
            this.activeSupplier = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeInvoices=false
            this.activeSettings=false
            this.activeReports=false
            this.activeSubscription = false
            this.closeAllAccordion(5)
          }
          else if (this.activeURL.includes('/All-invoices') 
          ||this.activeURL.includes('/All-credit-notes') 
          ||this.activeURL.includes('/Add-invoices')
          ||this.activeURL.includes('/credit-note-details/')
           ) {
            this.activeInvoices = true
            this.activeBalanceTransferRequest = false
            this.activeAllPaymentLinks = false
            this.activePrices = false
            this.activeProducts = false
            this.activeUser = false
            this.activeSupplier = false
            this.activePurchases = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeSettings=false
            this.activeReports=false
            this.activeSubscription = false
          }
          else if(this.activeURL.includes('/commercial-account-details') || this.activeURL.includes('/design-and-colors')){
            this.activeSettings=true
            this.activeInvoices = false
            this.activeBalanceTransferRequest = false
            this.activeAllPaymentLinks = false
            this.activePrices = false
            this.activeProducts = false
            this.activeUser = false
            this.activeSupplier = false
            this.activePurchases = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeReports=false
            this.activeSubscription = false
          }
          else if(this.activeURL.includes('/reports')){
            this.activeReports=true
            this.activeSettings=false
            this.activeInvoices = false
            this.activeBalanceTransferRequest = false
            this.activeAllPaymentLinks = false
            this.activePrices = false
            this.activeProducts = false
            this.activeUser = false
            this.activeSupplier = false
            this.activePurchases = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeSubscription = false
          }

          else if(this.activeURL.includes('/Subscription/subscription-payment')){
            this.activeReports=false
            this.activeSettings=false
            this.activeInvoices = false
            this.activeBalanceTransferRequest = false
            this.activeAllPaymentLinks = false
            this.activePrices = false
            this.activeProducts = false
            this.activeUser = false
            this.activeSupplier = false
            this.activePurchases = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeSubscription = true
          }

          else if(this.activeURL.includes('/user-profile')){
            this.activeReports=false
            this.activeSettings=false
            this.activeInvoices = false
            this.activeBalanceTransferRequest = false
            this.activeAllPaymentLinks = false
            this.activePrices = false
            this.activeProducts = false
            this.activeUser = false
            this.activeSupplier = false
            this.activePurchases = false
            this.activeReceiptv = false
            this.activeControl = false
            this.activeSubscription = false
          }
          if (this.activeURL.includes('/viewOnly')) {
            this.showSideNav = false;
          }
         
        }
  
      });
  
      if (this.activeURL.includes('/control')) {
        this.activeControl = true
      }
     else if (this.activeURL.includes('/All-receipt-voucher')) {
        this.activeReceiptv = true
      }
     else if (this.activeURL.includes('/purchases')) {
        this.activePurchases = true
      }
     else if (this.activeURL.includes('/users') && !this.activeURL.includes('/user-profile')) {
        this.activeUser = true
      }
      else if (this.activeURL.includes('/suppliers-list')) {
        this.activeSupplier = true;
      }
     else if (this.activeURL.includes('/products')) {
        this.activeProducts = true
      }
     else if (this.activeURL.includes('/prices')) {
        this.activePrices = true
      }
      else if (this.activeURL.includes('/All-payment-links')) {
        this.activeAllPaymentLinks = true
      }
      else if(this.activeURL.includes('Subscription/subscription-payment')){
        this.activeSubscription = true
      }
      else if(this.activeURL.includes('Subscription/subscription-payment')){
        this.activeSubscription = true
      }
      else if (this.activeURL.includes('/balance-transfer-request')) {
        this.activeBalanceTransferRequest = true
      }
      else if (this.activeURL.includes('/All-invoices') 
      ||this.activeURL.includes('/All-credit-notes') 
      ||this.activeURL.includes('/Add-invoices')
      ||this.activeURL.includes('/credit-note-details/')
       ) {
        this.activeInvoices = true
      }
      else if(this.activeURL.includes('/commercial-account-details')){
        this.activeSettings=true
      }
      else if(this.activeURL.includes('/reports')){
        this.activeReports=true
      }
      else if(this.activeURL.includes('/user-profile')){
        this.activeReports=false
        this.activeSettings=false
        this.activeInvoices = false
        this.activeBalanceTransferRequest = false
        this.activeAllPaymentLinks = false
        this.activePrices = false
        this.activeProducts = false
        this.activeUser = false
        this.activePurchases = false
        this.activeReceiptv = false
        this.activeControl = false
        this.activeSubscription = false
      }
       if (this.activeURL.includes('/viewOnly')) {
        this.showSideNav = false;
      }
    }
    if(this.role=='admin'){
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
       
          
          this.activeURL = event.url
          if (this.activeURL.includes('/control')) {
            this.activeControl = true
            this.activeUser=false
            this.activeAdminUser=false
            this.activeAdminRoles=false
            this.activeAdminCoupons=false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminSales=false
            this.activeAdminPaymentlinks = false
             this.activeRevenues=false
             this.activeAdminBlogs=false
             this.activeAdminMessages=false
             this.activeAdminTemplates=false
             this.activeAdminSettings=false
             this.activeAdminReports = false;

          }
          if (this.activeURL.includes('/Admin-Reports')) {
            this.activeAdminReports = true;
            this.activeControl = false
            this.activeUser=false
            this.activeAdminUser=false
            this.activeAdminRoles=false
            this.activeAdminCoupons=false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminSales=false
            this.activeAdminPaymentlinks = false
             this.activeRevenues=false
             this.activeAdminBlogs=false
             this.activeAdminMessages=false
             this.activeAdminTemplates=false
             this.activeAdminSettings=false


          }
         else if (this.activeURL.includes('/All-users')) {
            this.activeAdminReports = false;
            this.activeUser = true
            this.activeAdminUser=false
            this.activeControl = false
            this.activeAdminRoles=false
            this.activeAdminCoupons=false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminSales=false
            this.activeAdminPaymentlinks = false
            this.activeAdminBlogs=false

            this.activeRevenues=false

            this.activeAdminMessages=false
            this.activeAdminTemplates=false
            this.activeAdminSettings=false




          }
         else if (this.activeURL.includes('/All-administrative-users')) {
          this.activeAdminReports = false;
          this.activeUser = false
          this.activeAdminUser=true
          this.activeControl = false
          this.activeAdminRoles=false
          this.activeAdminCoupons=false
          this.activeAdminSubscriptionPlans=false
          this.activeAdminSales=false
          this.activeAdminPaymentlinks = false
          this.activeRevenues=false
          this.activeAdminBlogs=false
          this.activeAdminMessages=false
          this.activeAdminTemplates=false
          this.activeAdminSettings=false



          }
          else if (this.activeURL.includes('role')){
            this.activeAdminReports = false;
            this.activeAdminRoles=true
            this.activeUser = false
            this.activeAdminUser=false
            this.activeControl = false
            this.activeAdminCoupons=false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminSales=false
            this.activeAdminPaymentlinks = false

            this.activeRevenues=false
            this.activeAdminBlogs=false

            this.activeAdminMessages=false
            this.activeAdminTemplates=false
            this.activeAdminSettings=false




          }
          else if (this.activeURL.includes('coupons')){
            this.activeAdminReports = false;
            this.activeAdminCoupons=true
            this.activeAdminRoles=false
            this.activeUser = false
            this.activeAdminUser=false
            this.activeControl = false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminSales=false
            this.activeAdminPaymentlinks = false
            this.activeRevenues=false
            this.activeAdminBlogs=false
            this.activeAdminMessages=false
            this.activeAdminTemplates=false
            this.activeAdminSettings=false





          }
          else if (this.activeURL.includes('subscription-plans')){
            this.activeAdminReports = false;
            this.activeAdminSubscriptionPlans=true
            this.activeAdminCoupons=false
            this.activeAdminRoles=false
            this.activeUser = false
            this.activeAdminUser=false
            this.activeControl = false
            this.activeAdminSales=false
            this.activeAdminPaymentlinks = false
            this.activeRevenues=false
            this.activeAdminBlogs=false

            this.activeAdminMessages=false

            this.activeAdminTemplates=false
            this.activeAdminSettings=false



          }
          else if (this.activeURL.includes('credit-notes')||
          this.activeURL.includes('debit-notes')||
          this.activeURL.includes('invoices')||
          this.activeURL.includes('receipt-vouchers')||
          this.activeURL.includes('quotations')
          ){
            this.activeAdminReports = false;
            this.activeAdminSales=true
            this.activeAdminSubscriptionPlans=false
            this.activeAdminCoupons=false
            this.activeAdminRoles=false
            this.activeUser = false
            this.activeAdminUser=false
            this.activeControl = false
            this.activeAdminPaymentlinks = false
            this.activeRevenues=false
            this.activeAdminBlogs=false
            this.activeAdminMessages=false
            this.activeAdminTemplates=false
            this.activeAdminSettings=false








          }
          else if (this.activeURL.includes('/payment-links')) {
            this.activeAdminReports = false;
            this.activeAdminPaymentlinks = true
            this.activeAdminSales=false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminCoupons=false
            this.activeAdminRoles=false
            this.activeUser = false
            this.activeAdminUser=false
            this.activeControl = false
            this.activeRevenues=false
            this.activeAdminBlogs=false

            this.activeAdminMessages=false
            this.activeAdminTemplates=false
            this.activeAdminSettings=false


          }
          else if (this.activeURL.includes('/revenue')) {
            this.activeAdminReports = false;
            this.activeRevenues=true
            this.activeAdminPaymentlinks = false
            this.activeAdminSales=false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminCoupons=false
            this.activeAdminRoles=false
            this.activeUser = false
            this.activeAdminUser=false
            this.activeControl = false
            this.activeAdminBlogs=false
            this.activeAdminMessages=false
            this.activeAdminTemplates=false
            this.activeAdminSettings=false



          }
          else if (this.activeURL.includes('/blogs')) {
            this.activeAdminReports = false;
            this.activeAdminBlogs=true
            this.activeRevenues=false
            this.activeAdminPaymentlinks = false
            this.activeAdminSales=false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminCoupons=false
            this.activeAdminRoles=false
            this.activeUser = false
            this.activeAdminUser=false
            this.activeControl = false
            this.activeAdminMessages=false
            this.activeAdminTemplates=false
            this.activeAdminSettings=false



          }
          else if (this.activeURL.includes('/contact-us-messages')) {
            this.activeAdminReports = false;
            this.activeAdminMessages=true
            this.activeAdminBlogs=false
            this.activeRevenues=false
            this.activeAdminPaymentlinks = false
            this.activeAdminSales=false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminCoupons=false
            this.activeAdminRoles=false
            this.activeUser = false
            this.activeAdminUser=false
            this.activeControl = false

            this.activeAdminTemplates=false
            this.activeAdminSettings=false

          }
          else if (this.activeURL.includes('/templates')) {
            this.activeAdminReports = false;
            this.activeAdminTemplates=true
            this.activeAdminMessages=false
            this.activeAdminBlogs=false
            this.activeRevenues=false
            this.activeAdminPaymentlinks = false
            this.activeAdminSales=false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminCoupons=false
            this.activeAdminRoles=false
            this.activeUser = false
            this.activeAdminUser=false
            this.activeControl = false
            this.activeAdminSettings=false



          }
          else if (this.activeURL.includes('/settings')) {
            this.activeAdminReports = false;
            this.activeAdminSettings=true
            this.activeAdminTemplates=false
            this.activeAdminMessages=false
            this.activeAdminBlogs=false
            this.activeRevenues=false
            this.activeAdminPaymentlinks = false
            this.activeAdminSales=false
            this.activeAdminSubscriptionPlans=false
            this.activeAdminCoupons=false
            this.activeAdminRoles=false
            this.activeUser = false
            this.activeAdminUser=false
            this.activeControl = false


          }
  
        
        }
  
      });
  
      if (this.activeURL.includes('/control')) {
        this.activeControl = true
        this.activeUser=false
        this.activeAdminUser=false
        this.activeAdminRoles=false
        this.activeAdminCoupons=false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminSales=false
        this.activeAdminPaymentlinks = false
         this.activeRevenues=false
         this.activeAdminBlogs=false
         this.activeAdminMessages=false
         this.activeAdminTemplates=false
         this.activeAdminSettings=false
         this.activeAdminReports = false;

      }
      if (this.activeURL.includes('/Admin-Reports')) {
        this.activeAdminReports = true;
        this.activeControl = false
        this.activeUser=false
        this.activeAdminUser=false
        this.activeAdminRoles=false
        this.activeAdminCoupons=false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminSales=false
        this.activeAdminPaymentlinks = false
         this.activeRevenues=false
         this.activeAdminBlogs=false
         this.activeAdminMessages=false
         this.activeAdminTemplates=false
         this.activeAdminSettings=false
      }
     else if (this.activeURL.includes('/All-users')) {
        this.activeUser = true
        this.activeAdminUser=false
        this.activeControl = false
        this.activeAdminRoles=false
        this.activeAdminCoupons=false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminSales=false
        this.activeAdminPaymentlinks = false
        this.activeAdminBlogs=false

        this.activeRevenues=false

        this.activeAdminMessages=false
        this.activeAdminTemplates=false
        this.activeAdminSettings=false
        this.activeAdminReports = false;

      }
     else if (this.activeURL.includes('/All-administrative-users')) {
      this.activeUser = false
      this.activeAdminUser=true
      this.activeControl = false
      this.activeAdminRoles=false
      this.activeAdminCoupons=false
      this.activeAdminSubscriptionPlans=false
      this.activeAdminSales=false
      this.activeAdminPaymentlinks = false
      this.activeRevenues=false
      this.activeAdminBlogs=false
      this.activeAdminMessages=false
      this.activeAdminTemplates=false
      this.activeAdminSettings=false
      this.activeAdminReports = false;
      }
      else if (this.activeURL.includes('role')){
        this.activeAdminRoles=true
        this.activeUser = false
        this.activeAdminUser=false
        this.activeControl = false
        this.activeAdminCoupons=false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminSales=false
        this.activeAdminPaymentlinks = false

        this.activeRevenues=false
        this.activeAdminBlogs=false

        this.activeAdminMessages=false
        this.activeAdminTemplates=false
        this.activeAdminSettings=false
        this.activeAdminReports = false;
      }
      else if (this.activeURL.includes('coupons')){
        this.activeAdminCoupons=true
        this.activeAdminRoles=false
        this.activeUser = false
        this.activeAdminUser=false
        this.activeControl = false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminSales=false
        this.activeAdminPaymentlinks = false
        this.activeRevenues=false
        this.activeAdminBlogs=false
        this.activeAdminMessages=false
        this.activeAdminTemplates=false
        this.activeAdminSettings=false
        this.activeAdminReports = false;

      }
      else if (this.activeURL.includes('subscription-plans')){
        this.activeAdminSubscriptionPlans=true
        this.activeAdminCoupons=false
        this.activeAdminRoles=false
        this.activeUser = false
        this.activeAdminUser=false
        this.activeControl = false
        this.activeAdminSales=false
        this.activeAdminPaymentlinks = false
        this.activeRevenues=false
        this.activeAdminBlogs=false

        this.activeAdminMessages=false

        this.activeAdminTemplates=false
        this.activeAdminSettings=false
        this.activeAdminReports = false;
      }
      else if (this.activeURL.includes('credit-notes')||
      this.activeURL.includes('debit-notes')||
      this.activeURL.includes('invoices')||
      this.activeURL.includes('receipt-vouchers')||
      this.activeURL.includes('quotations')
      ){
        this.activeAdminSales=true
        this.activeAdminSubscriptionPlans=false
        this.activeAdminCoupons=false
        this.activeAdminRoles=false
        this.activeUser = false
        this.activeAdminUser=false
        this.activeControl = false
        this.activeAdminPaymentlinks = false
        this.activeRevenues=false
        this.activeAdminBlogs=false
        this.activeAdminMessages=false
        this.activeAdminTemplates=false
        this.activeAdminSettings=false
        this.activeAdminReports = false;

      }
      else if (this.activeURL.includes('/payment-links')) {
        this.activeAdminPaymentlinks = true
        this.activeAdminSales=false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminCoupons=false
        this.activeAdminRoles=false
        this.activeUser = false
        this.activeAdminUser=false
        this.activeControl = false
        this.activeRevenues=false
        this.activeAdminBlogs=false

        this.activeAdminMessages=false
        this.activeAdminTemplates=false
        this.activeAdminSettings=false
        this.activeAdminReports = false;
      }
      else if (this.activeURL.includes('/revenue')) {
        this.activeRevenues=true
        this.activeAdminPaymentlinks = false
        this.activeAdminSales=false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminCoupons=false
        this.activeAdminRoles=false
        this.activeUser = false
        this.activeAdminUser=false
        this.activeControl = false
        this.activeAdminBlogs=false
        this.activeAdminMessages=false
        this.activeAdminTemplates=false
        this.activeAdminSettings=false
        this.activeAdminReports = false;
      }
      else if (this.activeURL.includes('/blogs')) {
        this.activeAdminBlogs=true
        this.activeRevenues=false
        this.activeAdminPaymentlinks = false
        this.activeAdminSales=false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminCoupons=false
        this.activeAdminRoles=false
        this.activeUser = false
        this.activeAdminUser=false
        this.activeControl = false
        this.activeAdminMessages=false
        this.activeAdminTemplates=false
        this.activeAdminSettings=false
        this.activeAdminReports = false;
      }
      else if (this.activeURL.includes('/contact-us-messages')) {
        this.activeAdminMessages=true
        this.activeAdminBlogs=false
        this.activeRevenues=false
        this.activeAdminPaymentlinks = false
        this.activeAdminSales=false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminCoupons=false
        this.activeAdminRoles=false
        this.activeUser = false
        this.activeAdminUser=false
        this.activeControl = false

        this.activeAdminTemplates=false
        this.activeAdminSettings=false
        this.activeAdminReports = false;
      }
      else if (this.activeURL.includes('/templates')) {
        this.activeAdminTemplates=true
        this.activeAdminMessages=false
        this.activeAdminBlogs=false
        this.activeRevenues=false
        this.activeAdminPaymentlinks = false
        this.activeAdminSales=false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminCoupons=false
        this.activeAdminRoles=false
        this.activeUser = false
        this.activeAdminUser=false
        this.activeControl = false
        this.activeAdminSettings=false
        this.activeAdminReports = false;
      }
      else if (this.activeURL.includes('/settings')) {
        this.activeAdminTemplates=false
        this.activeAdminMessages=false
        this.activeAdminBlogs=false
        this.activeRevenues=false
        this.activeAdminPaymentlinks = false
        this.activeAdminSales=false
        this.activeAdminSubscriptionPlans=false
        this.activeAdminCoupons=false
        this.activeAdminRoles=false
        this.activeUser = false
        this.activeAdminUser=false
        this.activeControl = false
        this.activeAdminSettings=true
        this.activeAdminReports = false;
      }
     
      if (this.activeURL.includes('/viewOnly')) {
        this.showSideNav = false;
      }
    }

  }

  goToAllPaymentLinks(){
    this.router.navigate(['/user/payment-links/All-payment-links']).then(()=>{
      window.location.reload()
    })
  }
  goToBalanceTransferRequest(){
    this.router.navigate(['/user/payment-links/balance-transfer-request']).then(()=>{
      window.location.reload()
    })
  }
  @HostListener('window:resize', ['$event'])
   onResize(event:any) {
    this.checkScreenSize();
    setTimeout(() => {
      var offcanvasScrolling = document.getElementById('offcanvasScrolling');
      if(window.innerWidth > 1024){
        offcanvasScrolling?.classList.add('show');
      }else{
        offcanvasScrolling?.classList.remove('show');
      }
    }, 200);
  
  }
  LogOut(){}

  @ViewChild('invoices') invoices!: ElementRef<HTMLElement>;
  @ViewChild('purchases') purchases!: ElementRef<HTMLElement>;
  @ViewChild('reports') reports!: ElementRef<HTMLElement>;
  @ViewChild('settings') settings!: ElementRef<HTMLElement>;
  @ViewChild('sales') sales!: ElementRef<HTMLElement>;
  isOpenInvoices=false
  isOpenPurchases=false
  isOpenReports=false
  isOpenSettings=false

  closeAllAccordion(index:number){
    // invoice
     if(index==1){
      this.isOpenInvoices=!this.isOpenInvoices;
      if(this.isOpenInvoices){
        if(this.isOpenPurchases){
          let Purchases: HTMLElement = this.purchases.nativeElement;
          Purchases.click();
        }
        if(this.isOpenReports){
          let Reports: HTMLElement = this.reports.nativeElement;
          Reports.click();
        }
        if(this.isOpenSettings){
          let settings: HTMLElement = this.settings.nativeElement;
          settings.click();
        }

      }
     }
    //  Purchases
     if(index==2){
      this.isOpenPurchases=!this.isOpenPurchases;
      if(this.isOpenPurchases){
        if(this.isOpenInvoices){
          let Invoices: HTMLElement = this.invoices.nativeElement;
          Invoices.click();
        }
        if(this.isOpenReports){
          let Reports: HTMLElement = this.reports.nativeElement;
          Reports.click();
        }
        if(this.isOpenSettings){
          let settings: HTMLElement = this.settings.nativeElement;
          settings.click();
        }

      }
     }
    //  Reports
     if(index==3){
      this.isOpenReports=!this.isOpenReports;
      if(this.isOpenReports){

        if(this.isOpenInvoices){
          let Invoices: HTMLElement = this.invoices.nativeElement;
          Invoices.click();
        }
        if(this.isOpenPurchases){
          let Purchases: HTMLElement = this.purchases.nativeElement;
          Purchases.click();
        }
        if(this.isOpenSettings){
          let settings: HTMLElement = this.settings.nativeElement;
          settings.click();
        }

      }
     }

    //  Settings
     if(index==4){
      this.isOpenSettings=!this.isOpenSettings;
      if(this.isOpenSettings){

        if(this.isOpenInvoices){
          let Invoices: HTMLElement = this.invoices.nativeElement;
          Invoices.click();
        }
        if(this.isOpenPurchases){
          let Purchases: HTMLElement = this.purchases.nativeElement;
          Purchases.click();
        }
        if(this.isOpenReports){
          let Reports: HTMLElement = this.reports.nativeElement;
          Reports.click();
        }

      }
     }
    //  any page else
     if(index==5){
        if(this.isOpenInvoices){
          let Invoices: HTMLElement = this.invoices.nativeElement;
          Invoices.click();
        }
        if(this.isOpenPurchases){
          let Purchases: HTMLElement = this.purchases.nativeElement;
          Purchases.click();
        }
        if(this.isOpenReports){
          let Reports: HTMLElement = this.reports.nativeElement;
          Reports.click();
        }
        if(this.isOpenSettings){
          let settings: HTMLElement = this.settings.nativeElement;
          settings.click();
        }
     }


  }

  name:string =''
  email:string =''
  profileImage:string =''
  role:any
  getGeneralData(){
    let generalData =  localStorage.getItem('UserObj');
    if(generalData){
      let userData = JSON.parse(generalData);
      this.name = userData?.name
      this.email = userData?.email
      this.profileImage = userData?.media?.avatar
      this.role=userData?.role
    }else{
      this.subs.add(this.generalService.getGeneralData().subscribe({
        next:(res)=>{
          this.name = res?.data?.name
          this.email = res?.data?.email
          this.profileImage = res?.data?.media?.avatar
          this.role=res?.data?.role
          localStorage.setItem('UserObj',JSON.stringify(res?.user))
        }
      }));
    }
    
   }

   NavigateToURL(url:string){
    this.router.navigate(['/user/invoices/add-credit-note/create', '-1'], { queryParams: { reload: new Date().getTime() } });

    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([url, '-1']);
    // });
   }
}
