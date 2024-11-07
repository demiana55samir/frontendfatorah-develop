import { Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-user-details',
  templateUrl: './main-user-details.component.html',
  styleUrls: ['./main-user-details.component.scss']
})
export class MainUserDetailsComponent implements OnInit {
  activeItem!: MenuItem;

  items=[{label:'عرض بيانات العميل',command: (event:any) => {
    this.activeItem=this.items[0]
  }}
  ,{label:'الفواتير',command: (event:any) => {
    this.activeItem=this.items[1]
  }},
  {label:'سندات القبض',command: (event:any) => {
    this.activeItem=this.items[2]
  }},
  {label:'عروض الأسعار',command: (event:any) => {
    this.activeItem=this.items[3]
  }},
]
  constructor(private changeLanguage:ChangeLanguageService) { }
language:any
  ngOnInit() {
    this.language=this.changeLanguage.local_lenguage
    if(this.language=='en'){
      this.items[0].label='Show client'
      this.items[1].label='Invoices'
      this.items[2].label='Receipts'
      this.items[3].label='Quotations'
    }
    this.activeItem=this.items[0]


  }

}
