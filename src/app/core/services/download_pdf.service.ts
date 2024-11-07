import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Download_pdfService {

  baseURL = environment.baseUrl;
constructor(private httpClient: HttpClient) { }


download(url: string): Observable<Blob> {
  return this.httpClient.get(url, {
    responseType: 'blob',
    headers: new HttpHeaders({
      'Accept': 'application/pdf'
    })
  });
}

downloadAdminPayment(uuid:string,id:any){
  const url = `${this.baseURL}api/admin/subscriptions/${uuid}/${id}/invoice`; // Replace with your API URL
  this.downloadPDF(url,'invoice');
}

downloadSubscriptionsInvoice(uuid:string){
  const url = `${this.baseURL}api/dashboard/subscriptions/${uuid}/invoice`; // Replace with your API URL
  this.downloadPDF(url,'invoice');
}


downloadInvoice(uuid:string){
    const url = `${this.baseURL}api/invoices/${uuid}/print`; // Replace with your API URL
    this.downloadPDF(url,'invoice');
  }

downloadInvoice_deleted(uuid:string){
  const url = `${this.baseURL}api/admin/invoices/${uuid}/pdf`;
  this.downloadPDF(url,'invoice');
}
downloadSimplifiedInvoice(uuid:string){
  const url = `${this.baseURL}api/invoices/${uuid}/printAsSimplified`; // Replace with your API URL /api/invoices/{invoice}/printAsSimplified
  this.downloadPDF(url,'simplified_invoice');
}

downloadCreditNotes(uuid:string){
  const url = `${this.baseURL}api/credit_notes/${uuid}/print`; // Replace with your API URL
  this.downloadPDF(url,'credit_note');
}

downloadSimplifiedCreditNotes(uuid:string){
  const url = `${this.baseURL}api/credit_notes/${uuid}/printAsSimplified`; // Replace with your API URL
  this.downloadPDF(url,'simplified_credit_note');
}

downloadQuotations(uuid:string){
  const url = `${this.baseURL}api/quotations/${uuid}/print`; // Replace with your API URL
  this.downloadPDF(url,'quotation');
}

downloadTaxReports(report_id:string){
  const url = `${this.baseURL}api/dashboard/reports/generatePdf/${report_id}`; // Replace with your API URL
  this.downloadPDF(url,'TaxReport');
}

downloadReceipts(uuid:string){
  const url = `${this.baseURL}api/receipts/${uuid}/print`; // Replace with your API URL
  this.downloadPDF(url,'receipt');
}
  private downloadPDF(url:string , pdfName:string){
    this.download(url).subscribe(blob => {
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `${pdfName}.pdf`; // Set your file name
      link.click();
      window.URL.revokeObjectURL(downloadURL);
      });
  }
}
