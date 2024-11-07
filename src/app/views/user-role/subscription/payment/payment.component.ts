import { Component, HostListener, OnInit } from '@angular/core';
import { PaymentService } from '@services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit  {

  constructor(public paymentService:PaymentService) { }


  ngOnInit() {
    this.paymentService.initiatePayment()
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {

    if (event.key === 'PrintScreen') {
      alert('Screenshots are disabled for this content!');
      event.preventDefault();
    }
  }

}
