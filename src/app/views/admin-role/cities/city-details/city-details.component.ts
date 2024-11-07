import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { city } from '@modules/settings';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.component.html',
  styleUrls: ['./city-details.component.scss']
})
export class CityDetailsComponent implements OnInit {

  private subs=new Subscription()
  city:city = {} as city;
  cityId:any
  invoiceColor:any
  language:any
  constructor(private http:HttpService,private changelang:ChangeLanguageService,
    private activeRoute:ActivatedRoute) { }

   
  ngOnInit() {
    this.cityId= String(this.activeRoute.snapshot.paramMap.get('id'))
    this.language=this.changelang.local_lenguage
    this.getCity()
  }

  getCity(){
    this.subs.add(this.http.getReq(`api/admin/cities/${this.cityId}`).subscribe({
      next:res =>{
        this.city=res.data
      }
    }))
  }

}
