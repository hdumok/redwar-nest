import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class TimeUtil {
  getDate(time: number | string = Date.now()): string {
    return moment(new Date(time)).format('GGGG-MM-DD');
  }
}
