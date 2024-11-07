import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.scss']
})
export class MessageDetailsComponent implements OnInit {

  private subs= new Subscription()
  message:any
  messageId:any
  language:any
    constructor(private http:HttpService,private router:Router,private activeRoute:ActivatedRoute ,private changeLang:ChangeLanguageService) { }
  
    ngOnInit() {
      this.language=this.changeLang.local_lenguage
      this.messageId = String(this.activeRoute.snapshot.paramMap.get('id'))
      this.getCouponData(this.messageId)
    }
  
    getCouponData(id:any){
      this.subs.add(this.http.getReq(`api/admin/contact_us/${id}`).subscribe({
        next:res=>{
          this.message=res.data
        }
      }))
  
    }

}
