import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class FilterPipe implements PipeTransform {
  transform(value: Record<string, any>): Record<string, any> {
    return value;
  }
} 