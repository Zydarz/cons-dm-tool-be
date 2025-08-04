import moment from 'moment';

export class Util {
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  static getAllMonthAndYearFromStartDateAndEndDate(
    startDate: Date,
    endDate: Date,
  ): {
    startMonthDate: Date;
    endMonthDate: Date;
  }[] {
    const result: {
      startMonthDate: Date;
      endMonthDate: Date;
    }[] = [];
    const startMonth = +moment(startDate, 'YYYY/MM/DD').format('MM');
    const startYear = +moment(startDate, 'YYYY/MM/DD').format('YYYY');
    const endMonth = +moment(endDate, 'YYYY/MM/DD').format('MM');
    const endYear = +moment(endDate, 'YYYY/MM/DD').format('YYYY');
    let month = startMonth;
    let year = startYear;
    const diffMonth = (endYear - startYear) * 12 + (endMonth - startMonth);
    for (let i = 0; i <= diffMonth; i++) {
      const diffYear = Math.ceil((startMonth + i) / 12 - 1);
      year = startYear + diffYear;
      month = startMonth + i - 12 * diffYear;
      const monthStr = month > 9 ? `${month}` : `0${month}`;
      let startMonthDate = new Date(moment(startDate, 'YYYY/MM/DD').format('YYYY-MM-DD'));
      let endMonthDate = new Date(moment(endDate, 'YYYY/MM/DD').format('YYYY-MM-DD'));
      if (month !== startMonth || year !== startYear) {
        startMonthDate = new Date(`${year}-${monthStr}-01`);
      }
      if (month !== endMonth || year !== endYear) {
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        endMonthDate = new Date(`${year}-${monthStr}-${lastDayOfMonth}`);
      }
      result.push({ startMonthDate, endMonthDate });
    }
    return result;
  }

  static getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1);
  }

  static getLastDayOfMonth(year: number, month: number) {
    return new Date(year, month + 1, 0);
  }

  static getRangeDateByMonth(start: Date, end: Date) {
    const dateArr: any = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    while (startDate <= endDate) {
      const sDate = this.getFirstDayOfMonth(startDate.getFullYear(), startDate.getMonth());
      const eDate = this.getLastDayOfMonth(startDate.getFullYear(), startDate.getMonth());
      const sDateStr = moment(startDate).format('YYYY/MM/DD');
      const eDateStr = eDate < endDate ? moment(eDate).format('YYYY/MM/DD') : moment(endDate).format('YYYY/MM/DD');
      dateArr.push([sDateStr, eDateStr]);
      startDate.setMonth(sDate.getMonth() + 1);
    }
    return dateArr;
  }

  static getRangeDateByWeek(start: Date, end: Date) {
    const dateArr: any = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    while (startDate <= endDate) {
      const dayOfSDate = startDate.getDay();
      if (dayOfSDate === 6 || dayOfSDate === 0) {
        startDate.setDate(startDate.getDate() + 1);
        continue;
      }
      const sDateStr = moment(startDate).format('YYYY/MM/DD');
      startDate.setDate(startDate.getDate() + 5 - dayOfSDate);
      const eDateStr =
        startDate <= endDate ? moment(startDate).format('YYYY/MM/DD') : moment(endDate).format('YYYY/MM/DD');
      dateArr.push([sDateStr, eDateStr]);
      startDate.setDate(startDate.getDate() + 3);
    }
    return dateArr;
  }

  static checkDateInRangeDate(start: string, end: string, date: Date): boolean {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateCheck = new Date(date);
    if (startDate <= dateCheck && endDate >= dateCheck) {
      return true;
    }
    return false;
  }

  static isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
