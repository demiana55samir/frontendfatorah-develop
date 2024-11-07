import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.component.html',
  styleUrls: ['./coupon-details.component.scss']
})
export class CouponDetailsComponent implements OnInit {
private subs= new Subscription()
coupon:any
couponId:any
language:any
  constructor(private http:HttpService,private router:Router,private activeRoute:ActivatedRoute ,private changeLang:ChangeLanguageService) { }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.couponId = String(this.activeRoute.snapshot.paramMap.get('id'))
    this.getCouponData(this.couponId)
  }

  getCouponData(id:any){
    this.subs.add(this.http.getReq(`api/admin/vouchers/${id}`).subscribe({
      next:res=>{
        this.coupon=res.data
      }
    }))

  }
}
