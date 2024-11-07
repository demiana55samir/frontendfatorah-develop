import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {
private subs= new Subscription()
role:any
selectedData:any=[]
permissions:any=[]
roleId:any

  constructor(private http:HttpService,private activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.roleId = String(this.activeRoute.snapshot.paramMap.get('id'))
    this.getRoleDate(this.roleId)
    // this.selectedData=[1,2,3,4,5,6]
  }

  getRoleDate(id:any){
    this.subs.add(this.http.getReq(`api/admin/roles/${id}`).subscribe({
      next:res=>{
         this.role=res.data
         this.permissions=res.data.permissions
        //  this.role.permissions.forEach((element:any) => {
        //    this.selectedData.push(element.id)
        //  });
    }
    }))
  }

}
