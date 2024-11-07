import { Component, OnInit } from '@angular/core';
import { dashboard, topCards, top_clients, top_products } from '@models/dashboard';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-control-board',
  templateUrl: './control-board.component.html',
  styleUrls: ['./control-board.component.scss']
})
export class ControlBoardComponent implements OnInit {
 
  constructor(private http:HttpService) { }

  ngOnInit() {
  }

}
