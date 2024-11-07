import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-general-plan-details',
  templateUrl: './general-plan-details.component.html',
  styleUrls: ['./general-plan-details.component.scss']
})
export class GeneralPlanDetailsComponent implements OnInit {

  activeItem!: MenuItem;
  type:any
  items=[{id:'0',label:'عرض تفاصيل خطة الاشتراك',command: (event:any) => {
    this.activeItem=this.items[0]
  }}
  ,{id:'1',label:'مميزات خطة الاشتراك',command: (event:any) => {
    this.activeItem=this.items[1]
  }}
//   ,{id:'2',label:'مدد الاشتراك',command: (event:any) => {
//   this.activeItem=this.items[2]
// }}
]



  constructor(private changeLang:ChangeLanguageService,private activeRoute:ActivatedRoute) { }
language:any
  ngOnInit() {

    this.activeItem=this.items[0]
    this.type = String(this.activeRoute.snapshot.paramMap.get('id'))
    // alert(this.type)
    this.language=this.changeLang.local_lenguage
    if(this.language=='en'){
      this.items[0].label="Subscription Plan Details"
      this.items[1].label="Subscription Plan Features"
      // this.items[2].label="Plan Durations"
    }
    // if(this.type=='details'){
    //   this.activeItem=this.items[0]
    // }
    // else{
    //   this.activeItem=this.items[1]
    // }
  }

}
