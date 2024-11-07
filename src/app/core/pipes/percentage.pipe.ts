import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(count: number, total: number): string {

    if (total == 0) {
      return '0%';
    }
    const percentage = (count / total) * 100;
    return `${percentage.toFixed(2)}%`;
  }

}
