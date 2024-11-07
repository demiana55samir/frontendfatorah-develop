import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-delete-error-popup',
  templateUrl: './delete-error-popup.component.html',
  styleUrls: ['./delete-error-popup.component.scss']
})
export class DeleteErrorPopupComponent implements OnInit {
  @Output() ChoosenEvent:EventEmitter<{delete:boolean,cancle:boolean}> = new EventEmitter<{delete:boolean,cancle:boolean}>();

  constructor() { }

  ngOnInit() {
  }


  emitChoosenEvent(daleteEvent:boolean,cancleEvent:boolean){
    let event={
      'delete':daleteEvent,
      'cancle':cancleEvent
    }

    if(daleteEvent==true){
      this.ChoosenEvent.emit(event)
    }
    this.closeModalClick()
    // if(cancleEvent==true){
    //   this.closeModalClick()
    //   this.ChoosenEvent.emit(event)
    // }
  }

  @ViewChild('closeModal') closeModal!: ElementRef<HTMLElement>;
  closeModalClick() {
    let el: HTMLElement = this.closeModal.nativeElement;
    el.click();
  }

  @ViewChild('OpenModalBtn') OpenModalBtn!: ElementRef<HTMLElement>;
  openModel(){
    setTimeout(()=>{
      let el: HTMLElement = this.OpenModalBtn.nativeElement;
      el.click();
    },600)
  }
}
