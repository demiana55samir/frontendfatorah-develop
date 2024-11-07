import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { duration, durations_details, plan_details } from '@modules/subscription-plans';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss']
})
export class PlanDetailsComponent implements OnInit {
  private subs= new Subscription()
  plan:plan_details = {} as plan_details;
  planId:any
  language:any
  constructor(private http:HttpService,private activeRoute:ActivatedRoute,private changelang:ChangeLanguageService) { 
    this.plan.durations = {} as durations_details;
  }

  ngOnInit() {
    this.planId = String(this.activeRoute.snapshot.paramMap.get('id'))
    this.getPlanData(this.planId)

  }

  
  getPlanData(id:any){
    this.subs.add(this.http.getReq(`api/admin/plans/${id}`).subscribe({
      next:res=>{
        this.plan=res.data

      }
    }))
  }

}
