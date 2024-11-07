import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { quotations } from '@models/quotations';
import { HttpService } from '@services/http.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-quotation-templates',
  templateUrl: './quotation-templates.component.html',
  styleUrls: ['./quotation-templates.component.scss']
})
export class QuotationTemplatesComponent implements OnInit {

  @Input() quotationType:number=4
  @Input() invoiceColor:string=''
  @Input() logoUrl:string=''
  logo:any
  @Input() quotation:any

  @ViewChild('toDownload') htmlPage!: ElementRef;
  content:any;
  products:any[] = [
    {
    created_at: "2023-06-01T10:43:16.000000Z",
    discount: 12,
    name: "منتج",
    price: 12,
    product_id: 38,
    quantity: 12,
    tax: 0,
    total: 132,
    type: "service",
    user_id: 3644,
    uuid: "6b891d08-dcbb-4bea-a528-9bb563b17ad4"
  },
  {
    created_at: "2023-06-01T10:43:16.000000Z",
    discount: 12,
    name: "منتج",
    price: 12,
    product_id: 38,
    quantity: 12,
    tax: 0,
    total: 132,
    type: "service",
    user_id: 3644,
    uuid: "6b891d08-dcbb-4bea-a528-9bb563b17ad4"
  }
];
bank_accounts: any[] = [
  {
      "id": 393,
      "uuid": "c06f97c8-6e06-4281-9392-cd67af73eb7a",
      "user_id": 3644,
      "name": "test",
      "full_name": "test",
      "number": "100120",
      "created_at": "2022-04-11T20:42:46.000000Z",
      "updated_at": "2022-04-11T20:43:44.000000Z",
      "deleted_at": null
  },
  {
      "id": 423,
      "uuid": "5b6dace3-dd59-4e61-b142-5a88554e1c9e",
      "user_id": 3644,
      "name": "biat125bia",
      "full_name": "biatiena",
      "number": "dzada",
      "created_at": "2022-05-16T20:43:39.000000Z",
      "updated_at": "2022-05-16T20:43:39.000000Z",
      "deleted_at": null
  },
  {
      "id": 451,
      "uuid": "55cbd4bf-4406-4ca1-8e7f-52d8999ac224",
      "user_id": 3644,
      "name": "rajhi",
      "full_name": "rajhi",
      "number": "12456",
      "created_at": "2022-06-09T17:27:19.000000Z",
      "updated_at": "2022-06-09T17:27:19.000000Z",
      "deleted_at": null
  },
  {
      "id": 452,
      "uuid": "792103eb-ea63-4029-9811-b33923f15f83",
      "user_id": 3644,
      "name": "rajhi",
      "full_name": "rajhi",
      "number": "124567899",
      "created_at": "2022-06-09T17:39:12.000000Z",
      "updated_at": "2022-06-09T17:39:12.000000Z",
      "deleted_at": null
  },
  {
      "id": 453,
      "uuid": "9fa9fa37-7cab-48de-a384-a2082eea0e9c",
      "user_id": 3644,
      "name": "rajhii",
      "full_name": "rajhou",
      "number": "12456789898",
      "created_at": "2022-06-09T17:40:02.000000Z",
      "updated_at": "2022-06-09T17:40:02.000000Z",
      "deleted_at": null
  },
  {
      "id": 454,
      "uuid": "3a0b1bff-ce1e-4615-ae91-e022e7694b51",
      "user_id": 3644,
      "name": "rajhouna",
      "full_name": "rajhouniia",
      "number": "852369741",
      "created_at": "2022-06-09T17:44:40.000000Z",
      "updated_at": "2022-06-09T17:44:40.000000Z",
      "deleted_at": null
  },
  {
      "id": 462,
      "uuid": "9ccd17b1-62c4-46e3-9e14-2aa556c836b4",
      "user_id": 3644,
      "name": "new bank",
      "full_name": "new bank",
      "number": "12",
      "created_at": "2023-08-10T10:35:13.000000Z",
      "updated_at": "2023-08-10T10:35:13.000000Z",
      "deleted_at": null
  }
]


  constructor(private http:HttpService) { }

  ngOnInit() {
      document.documentElement.style.setProperty('--invoiceColor',this.invoiceColor);

   }

   downloadPDF() {
    // console.log(this.quotation)
    const content = this.htmlPage?.nativeElement;
    const width = this.htmlPage.nativeElement.clientWidth;
    const height = this.htmlPage.nativeElement.clientHeight;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [width + 50, height]
      });
    html2canvas(content, {
      scale: 2
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 110;
      const pageHeight = 650;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      
      
      let heightLeft = imgHeight;
      let position = 0;
      let width = doc.internal.pageSize.getWidth();
      let height = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, position, width, height);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      doc.save('quotation.pdf');
    });
  }


}
