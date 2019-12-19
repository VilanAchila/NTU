import {Injectable} from '@angular/core';
import {DateRange} from '../widgets/date-range-picker/public-api';

@Injectable({
  providedIn: 'root'
})

export class DateServiceService {

  constructor() {
  }

  private setDate(date: number, month: number, year: number) {
    const dateObject = new Date();
    dateObject.setDate(date);
    dateObject.setMonth(month);
    dateObject.setFullYear(year);
    return dateObject;
  }

  private setDateRange(month: number, date: number, year: number) {
    const dateRange = new DateRange();
    dateRange.start = new Date();
    dateRange.end = new Date();
    dateRange.start.setDate(date);
    dateRange.start.setMonth(month);
    dateRange.start.setFullYear(year);
    return dateRange;
  }

  getRoundedHalfHour = (minutes, d=new Date()) => {

    let ms = 1000 * 60 * minutes;
    let roundedDate;
    roundedDate =  new Date(Math.round(d.getTime() / ms) * ms);

    if(roundedDate>new Date()){
      roundedDate =  new Date(roundedDate.setMinutes( roundedDate.getMinutes() - 30 ));
    }

    return roundedDate;
  }


  getToday(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(today.getMonth());
    date.start.setDate(today.getDate());
    date.start.setFullYear(today.getFullYear());

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(date.end.getDate()+1);
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getThisWeek(today: Date){
    let date = new DateRange();
    let weekFirst = today.getDate() - today.getDay()+1;
    let weekLast = weekFirst + 7;

    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(date.start.getMonth());
    date.start.setDate(weekFirst);
    date.start.setFullYear(date.start.getFullYear());

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(weekLast);
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getLastSevenDays(today: Date){
    let date = new DateRange();
    let start = today.getDate() - 7;

    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(date.start.getMonth());
    date.start.setDate(start);
    date.start.setFullYear(date.start.getFullYear());

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(today.getDate());
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getTwoMonth(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(date.start.getMonth()-2);
    date.start.setDate(1);
    date.start.setFullYear(date.start.getFullYear());

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(1);
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getThisMonth(today: Date){
    let date = new DateRange();
    date.end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    date.start = new Date(today);

    date.start.setMonth(date.start.getMonth());
    date.start.setDate(1);
    date.start.setFullYear(date.start.getFullYear());

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(1);
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getThisYear(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(0);
    date.start.setDate(1);
    date.start.setFullYear(date.start.getFullYear());

    date.end.setMonth(date.end.getMonth());
    date.end.setDate(date.end.getDate());
    date.end.setFullYear(date.end.getFullYear());

    return date;
  }

  getThisFullYear(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(0);
    date.start.setDate(1);
    date.start.setFullYear(date.start.getFullYear());

    date.end.setMonth(11);
    date.end.setDate(31);
    date.end.setFullYear(date.end.getFullYear());
    return date;
  }

  getLastFiveYear(today: Date){
    let date = new DateRange();
    date.end = new Date(today);
    date.start = new Date(today);

    date.start.setMonth(0);
    date.start.setDate(1);
    date.start.setFullYear(date.start.getFullYear()-4);

    date.end.setMonth(11);
    date.end.setDate(31);
    date.end.setFullYear(date.end.getFullYear());
    return date;
  }

  getLastSixMonth(today: Date){

    let date = new DateRange();
    date.end = new Date();
    date.start = new Date();

    date.start.setMonth(today.getMonth()-6);
    date.start.setDate(1);
    date.start.setFullYear(today.getFullYear());

    date.end.setMonth(today.getMonth());
    date.end.setDate(1);
    date.end.setFullYear(today.getFullYear());

    return date;
  }

}
