import { Component, Input, OnInit } from '@angular/core';
import { cardData, cardData1 } from '@models/landing';
import { ChangeLanguageService } from '@services/changeLanguage.service';



@Component({
  selector: 'app-dataCard',
  templateUrl: './dataCard.component.html',
  styleUrls: ['./dataCard.component.scss']
})
export class DataCardComponent implements OnInit {
  @Input() item!:cardData
  @Input() item1!:cardData1
  language:any
  constructor(private changelngServ:ChangeLanguageService) { }

  ngOnInit() {
  this.language=this.changelngServ.local_lenguage
  }

}
