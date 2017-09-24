import { Injectable } from '@angular/core';
import { GlobalState } from '../global.state';
import * as _ from 'lodash';

@Injectable()
export class Common {
    // 获取日期格式的年份
    getDateYear(date: string): number {
        return Number.parseInt(date.split('-')[0]);
    }
    // 获取日期格式的月份
    getDateMonth(date: string): number {
        return Number.parseInt(date.split('-')[1]);
    }
    // 获取日期格式的天数
    getDateDay(date: string): number {
        return Number.parseInt(date.split('-')[2]);
    }
    // 根据日期对象获取日期字符串
    getDateString(date: any): string {
        return `${date.year}-${date.month}-${date.day}`
    }
}