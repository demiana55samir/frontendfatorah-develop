import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { paymentLinks } from '@models/payment-link';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-link-details',
  templateUrl: './payment-link-details.component.html',
  styleUrls: ['./payment-link-details.component.scss']
})
export class PaymentLinkDetailsComponent implements OnInit {

  linkuuid:any=''
  subs=new Subscription()
  paymentLink:paymentLinks={} as paymentLinks
  isMobile = false;
  constructor(private http:HttpService,private changelang:ChangeLanguageService , private activeRoute:ActivatedRoute) {
   }
   language:any
  ngOnInit() {
    this.isMobile = window.innerWidth <= 768; 
    this.language=this.changelang.local_lenguage
    this.linkuuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
    this.getLinkData(this.linkuuid)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth <= 768; 
  }
  
  getLinkData(uuid:string){
    this.subs.add(this.http.getReq(`api/admin/payment_links/${uuid}`).subscribe({
      next:res=>{
        this.paymentLink = res?.data
      }
    }))
  }
  scrollFunc(sectionName: string) {
    var elem = document.getElementById(sectionName);
    elem?.scrollIntoView();
  }

}
