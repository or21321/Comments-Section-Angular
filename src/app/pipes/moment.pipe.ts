import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: string | undefined, ...args: unknown[]): unknown {
    if (!value) return 'Unknown'

    const MINUTE = 59
    const HOUR = 60 * 60
    const DAY = 60 * 60 * 24

    // Support 2 kinds of value (timestamp and date string)
    let timePassedInSecs = ((Date.now() - Date.parse(value)) / 1000)
      || (Date.now() - +value) / 1000
    // Calculate the string and return:
    if (timePassedInSecs <= 2) {
      return 'הרגע'
    }
    else if (timePassedInSecs <= MINUTE) {
      return timePassedInSecs.toFixed(0) + ' ' + 'שניות'
    } else if (timePassedInSecs <= HOUR) {
      return (timePassedInSecs / 60).toFixed(0) + ' ' + 'דק'
    } else if (timePassedInSecs <= DAY) {
      return (timePassedInSecs / (60 * 60)).toFixed(0) + ' ' + 'שעות'
    } else {
      const date = new Date(Date.parse(value))
      return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
    }
  }
}
