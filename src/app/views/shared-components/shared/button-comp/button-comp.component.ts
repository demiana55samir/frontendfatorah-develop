import { Component,Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeneralUserDataService } from '@services/generalUserData.service';
import { HttpService } from '@services/http.service';

@Component({
  selector: 'app-button-comp',
  templateUrl: './button-comp.component.html',
  styleUrls: ['./button-comp.component.scss']
})
export class ButtonCompComponent implements OnInit , OnChanges {
  @Input() bottonData:{name:string,color:string,icon:string}={name:"",color:"",icon:""}


  @Input() name:string= ''
  @Input() color:string= ''
  @Input() background_color:string= ''
  @Input() image:string= ''
  @Input() btnType:string=''
user:any
mainColor:any
secondryColor:any
  displayData:{name:string,color:string,icon:string}={name:"",color:"",icon:""}
  display=false
  constructor(private http:HttpService,private useradataServ:GeneralUserDataService) { }

  ngOnInit() {
   if(localStorage.getItem('primaryColor')){
     this.mainColor=localStorage.getItem('primaryColor')
   }
   else{
    this.mainColor='#5C60F5'
   }
   if(localStorage.getItem('secondaryColor')){
     this.secondryColor=localStorage.getItem('secondaryColor')
   }
   else{
    this.secondryColor='#5C60F5'
   }
  }
  ngOnChanges(changes:SimpleChanges):void{
    if(changes['bottonData']){
      this.displayData=this.bottonData
      this.display=true
    }
    // console.log('color',this.color)
  }

  
}
