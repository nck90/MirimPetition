import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class SearchPipe implements PipeTransform {
  transform(value: Record<string, any>): Record<string, any> {
    if (!value) return {};

    const searchFields = ['title', 'content', 'category'];
    const searchParams: Record<string, any> = {};

    for (const field of searchFields) {
      if (value[field] !== undefined) {
        searchParams[field] = value[field];
      }
    }

    return searchParams;
  }
} 