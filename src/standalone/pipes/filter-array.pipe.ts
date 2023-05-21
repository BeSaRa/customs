import { Pipe, PipeTransform } from '@angular/core';
import { objectHasOwnProperty } from '@utils/utils';

@Pipe({
  name: 'FilterArray',
  standalone: true,
})
export class FilterArrayPipe implements PipeTransform {
  transform<T>(
    options: T[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bindFilter: string | ((item: any) => any) | undefined,
    filterTxt: string | null
  ) {
    if (!filterTxt || !options || !bindFilter) return options;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getBindFilter(option: unknown): any {
      return bindFilter && typeof bindFilter === 'string'
        ? typeof (option as never)[bindFilter] === 'function'
          ? ((option as never)[bindFilter] as () => unknown)()
          : objectHasOwnProperty(option, bindFilter)
          ? option[bindFilter]
          : option
        : bindFilter && typeof bindFilter === 'function'
        ? bindFilter(option)
        : option;
    }

    return options.filter((option) => {
      return getBindFilter(option)
        .toLowerCase()
        .includes(filterTxt.toLowerCase());
    });
  }
}
