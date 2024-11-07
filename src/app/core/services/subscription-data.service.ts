import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { subscriptionData } from '@models/userSubscriptioData';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDataService {
 subscriptioData:subscriptionData={} as subscriptionData
constructor(private http:HttpService) { }

GetUserSubscriptionData() {
  return this.http.getReq('api/dashboard/check_usage')
}


}
