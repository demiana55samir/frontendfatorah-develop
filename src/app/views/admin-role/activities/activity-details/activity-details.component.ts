import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { activity } from '@modules/settings';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss']
})
export class ActivityDetailsComponent implements OnInit {

  private subs=new Subscription()
  activity:activity = {} as activity;
  activityId:any
  language:any
  constructor(private http:HttpService,private changelang:ChangeLanguageService,
    private activeRoute:ActivatedRoute) {}

  ngOnInit() {
    this.activityId= String(this.activeRoute.snapshot.paramMap.get('id'))
    this.language=this.changelang.local_lenguage
    this.getActivity()
  }

  getActivity(){
    this.subs.add(this.http.getReq(`api/admin/business_types/${this.activityId}`).subscribe({
      next:res =>{
        this.activity=res.data
      }
    }))
  }

}
