import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blogs-details',
  templateUrl: './blogs-details.component.html',
  styleUrls: ['./blogs-details.component.scss']
})
export class BlogsDetailsComponent implements OnInit {
article:any
tags:any
articleId:any
private subs=new Subscription()
  constructor(private http:HttpService,private activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.articleId = String(this.activeRoute.snapshot.paramMap.get('id'))
    this.getArticleData(this.articleId)
  }

  getArticleData(acticleId:any){
    this.subs.add(this.http.getReq(`api/admin/blogs/${acticleId}`).subscribe({
     next:res=>{
       this.article=res.data
       this.tags=res.data.tags
 
     }
    }))
   }

}
