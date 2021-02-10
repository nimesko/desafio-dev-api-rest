import { Injectable, PipeTransform } from '@nestjs/common';
import * as dayjs from 'dayjs';

@Injectable()
export class DatePipe implements PipeTransform {
  transform(value: any) {
    return dayjs(value).toDate();
  }
}
