import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: any) {
    return value;
  }
} 