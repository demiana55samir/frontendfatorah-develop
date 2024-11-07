import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (isNaN(value)) {
      return value;
    }

    const num = Number(value);

    if (num < 1000) {
      return num; 
    }

    const si = [
      { value: 1E18, symbol: "E" },
      { value: 1E15, symbol: "P" },
      { value: 1E12, symbol: "T" },
      { value: 1E9, symbol: "B" }, 
      { value: 1E6, symbol: "M" }, 
      { value: 1E3, symbol: "K" }  
    ];

    
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      const rounded = Math.floor((num / si[i].value) * 10) / 10;
      return rounded.toString().replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol;
    }
  }
  return num.toString();

  }

}
