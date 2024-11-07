
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService  {

  constructor(private http:HttpService,
    private router:Router
  ) {} 
 
 getCities(){
    return this.http.getReq('api/v2/cities');
 }
 getCategories(){
    return this.http.getReq('api/v2/categories');
 }
 getSubCategories(){
    return this.http.getReq('api/v2/sub-categories');
 }

 getGeneralData() {
   return this.http.getReq('api/dashboard/settings/general')
 }

 getDate_admin(duration_value:number){
   
   let startDate,endDate;
   if(duration_value==1){
     startDate=new Date();
     startDate.setHours(0, 0, 0, 0);

     endDate=new Date();
     endDate.setHours(23, 59, 59, 999);

   }
   else if(duration_value==2){
     startDate = new Date();
     endDate = new Date();
     startDate.setDate(endDate.getDate() - 1);
     startDate.setHours(0, 0, 0, 0);

     endDate=new Date(startDate);
     endDate.setHours(23, 59, 59, 999);

   }
   else if(duration_value==3){
     startDate = new Date();
     endDate = new Date();
     startDate.setDate(startDate.getDate() - 7);
     startDate.setHours(0, 0, 0, 0);

     endDate=new Date();
     endDate.setHours(23, 59, 59, 999);

   }
   else if(duration_value==4){
     startDate = new Date();
     endDate = new Date();
     startDate.setDate(startDate.getDate() - 30);
     startDate.setHours(0, 0, 0, 0);

     endDate=new Date();
     endDate.setHours(23, 59, 59, 999);

   }
   else if(duration_value==5){
     startDate = new Date();
     startDate.setDate(startDate.getDate() - 30);
     endDate = new Date();
     startDate.setHours(0, 0, 0, 0);
     endDate=new Date(startDate);
     endDate.setHours(23, 59, 59, 999);

     const currentDate = new Date();
     startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    endDate = new Date(nextMonthStart.getTime() - 1);

   }
   else if(duration_value==6){
     startDate = new Date();
     startDate.setMonth(startDate.getMonth() - 1);
     startDate.setDate(1);
     startDate.setHours(0, 0, 0, 0);
     endDate = new Date(startDate);
     endDate.setMonth(endDate.getMonth() + 1);
     endDate.setDate(0);
     endDate.setHours(23, 59, 59, 999);

   }
   else if(duration_value==7){
     startDate = new Date();
     startDate.setMonth(startDate.getMonth() - 3);
     startDate.setDate(1);
     startDate.setHours(0, 0, 0, 0);
     endDate = new Date(startDate);
     endDate.setMonth( endDate.getMonth() + 3);
     endDate.setDate(0);
     endDate.setHours(23, 59, 59, 999);

   }
   else if(duration_value==8){
     startDate = new Date();
     startDate.setMonth(startDate.getMonth() - 6);
     startDate.setDate(1);
     startDate.setHours(0, 0, 0, 0);
     endDate = new Date(startDate);
     endDate.setMonth( endDate.getMonth() + 6);
     endDate.setDate(0);
     endDate.setHours(23, 59, 59, 999);

   }
   else if(duration_value==9){
     startDate = new Date();
     startDate.setFullYear(startDate.getFullYear() - 1);
     startDate.setMonth(0);
     startDate.setDate(1);
     startDate.setHours(0, 0, 0, 0);
     endDate= new Date(startDate);
     endDate.setFullYear(endDate.getFullYear() + 1);
     endDate.setMonth(0);
     endDate.setDate(0);
     endDate.setHours(23, 59, 59, 999);

   }
   else if(duration_value==10){
     startDate = '2020-04-14';
     endDate= new Date();
   }


   return {startDate , endDate};
 }

 navigateToNotes(notesType:string) {
  this.router.navigateByUrl(`/user/invoices/${notesType}-note-details/create/-1`, { skipLocationChange: true }).then(() => {
    this.router.navigate([`/user/invoices/${notesType}-note-details/create`, -1]);
  });
}

}
