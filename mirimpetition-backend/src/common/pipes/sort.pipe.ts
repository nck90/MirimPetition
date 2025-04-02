import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class SortPipe implements PipeTransform {
  transform(value: Record<string, any>): Record<string, any> {
    if (!value) return {};

    const sortFields = ['createdAt', 'updatedAt', 'agreeCount', 'disagreeCount', 'viewCount'];
    const sortParams: Record<string, any> = {};

    for (const field of sortFields) {
      if (value[field] !== undefined) {
        sortParams[field] = value[field];
      }
    }

    return sortParams;
  }
} 