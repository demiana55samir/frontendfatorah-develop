import { Component, OnInit } from '@angular/core';
import { GeneralService } from '@services/general.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  private subs=new Subscription();
  constructor(private generalService:GeneralService) { }

  ngOnInit() {

  }


  getGeneralData(){
    this.subs.add(this.generalService.getGeneralData().subscribe({
       next:(res)=>{
        localStorage.setItem('UserObj',JSON.stringify(res?.user))
       }
     }));
   }
}
