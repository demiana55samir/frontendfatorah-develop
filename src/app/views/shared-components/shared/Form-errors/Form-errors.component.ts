import { Component, Input, OnInit } from '@angular/core';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { ValidationService } from '@services/validation.service';

@Component({
  selector: 'app-Form-errors',
  templateUrl: './Form-errors.component.html',
  styleUrls: ['./Form-errors.component.scss']
})
export class FormErrorsComponent implements OnInit {

  @Input() control: any;
  constructor(private validation: ValidationService,public langservice:ChangeLanguageService) { }
  emailRegex = this.validation.emailPattern;
  alphaRegex = this.validation.alphaPattern;
  numericalRegex = this.validation.numerical;
  passwordRegex = this.validation.passwordPattern;
  preventSpaceRegex = this.validation.preventSpaces;
  skuPattern = this.validation.skuPattern;
  liscencePattern = this.validation.liscencePattern;
  taxIdPattern = this.validation.taxIdPattern;
  phoneRegex = this.validation.phonePattern;
  paymentRegx= this.validation.paymentConfirm;
  decimalValuRegex= this.validation.decimalPattern;
  passwordGeneralRegex = this.validation.passwordGeneral;
  EgyptphoneRegex = this.validation.EgyptphonePattern
  webSiteRegex =this.validation.webSiteValidation;
  floatPattern=this.validation.floatPattern;
  saudiNumber = this.validation.saudiNumber;
  
  textOnly = this.validation.textOnly;
  ngOnInit(): void {
  }

}
