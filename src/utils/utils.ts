import { FormControlDirective, FormControlName, NgModel } from '@angular/forms';
import { AdminResult } from '@models/admin-result';
import { ICitations } from '@models/base-message';
import { format } from 'date-fns';
import {
  catchError,
  filter,
  MonoTypeOperatorFunction,
  Observable,
  of,
} from 'rxjs';

/**
 * to check if the NgControl is NgModel
 * @param control
 */
export function isNgModel(control: unknown): control is NgModel {
  return control instanceof NgModel;
}

/**
 * to check if the NgControl is FormControlDirective
 * @param control
 */
export function isFormControlDirective(
  control: unknown,
): control is FormControlDirective {
  return control instanceof FormControlDirective;
}

/**
 * to check if the NgControl is FormControlName
 * @param control
 */
export function isFormControlName(
  control: unknown,
): control is FormControlName {
  return control instanceof FormControlName;
}

/**
 * operator to ignore the errors came from observable and keep it a live
 * @param debug just to console log the error
 */
export function ignoreErrors<T>(debug = false): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    return source
      .pipe(
        catchError(error => {
          debug && console.log(error);
          return of('CUSTOM_ERROR' as T);
        }),
      )
      .pipe(filter<T>((value): value is T => value !== 'CUSTOM_ERROR'));
  };
}

/**
 * chunk provided array by given bulk size
 * @param arr
 * @param bulkSize
 */
export function arrayChunk<T>(arr: T[], bulkSize = 3): T[][] {
  const bulks: T[][] = [];
  for (let i = 0; i < Math.ceil(arr.length / bulkSize); i++) {
    bulks.push(arr.slice(i * bulkSize, (i + 1) * bulkSize));
  }
  return bulks;
}

/**
 * @description Generates the html ordered list of passed string values
 * @param title
 * @param namesList
 */
export function generateHtmlList(
  title: string,
  namesList: string[],
): HTMLDivElement {
  const div = document.createElement('div');
  div.classList.add('dynamic-list-container');

  const titleElement = document.createElement('h6');
  titleElement.innerText = title;

  const list: HTMLOListElement = document.createElement('ol');
  for (const name of namesList) {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(name));
    list.appendChild(item);
  }

  div.append(titleElement);
  div.append(list);
  return div;
}

/**
 * @description Opens the blob data in new browser tab or download if IE browser
 * @param data
 * @param fileName
 */
export function printBlobData(data: Blob, fileName?: string): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).msSaveOrOpenBlob) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).msSaveOrOpenBlob(
      data,
      fileName ?? 'customs-' + new Date().valueOf() + '.pdf',
    );
  } else {
    const a: HTMLAnchorElement = document.createElement('a');
    const url = URL.createObjectURL(data);
    a.href = URL.createObjectURL(data);
    a.target = '_blank';
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  }
}

/**
 * @description Checks if given value is valid
 * @param value
 * Value to check for validity
 */
export function isValidValue(value: unknown): boolean {
  return typeof value === 'string'
    ? value.trim() !== ''
    : typeof value !== 'undefined' && value !== null;
}

/**
 * @description has valida length
 * @param value
 */
export function hasValidLength(value: unknown): boolean {
  if (!isValidValue(value)) {
    return false;
  }
  return typeof value === 'string' || typeof value === 'number';
}

/**
 * @description Checks if given object is empty(not having properties)
 * @param objectToCheck
 * Object to check for emptiness
 */
export function isEmptyObject(objectToCheck: object): boolean {
  for (const key in objectToCheck) {
    if (Object.prototype.hasOwnProperty.call(objectToCheck, key)) {
      return false;
    }
  }
  return true;
}

/**
 * @description Check if object has any property with value
 * @param objectToCheck
 * Object to check for property values
 */
export function objectHasValue(objectToCheck: object): boolean {
  return Object.values(objectToCheck).some(value => isValidValue(value));
}

/**
 * @description Checks if the admin result is valid
 * @param model
 * AdminResult value to check
 */
export function isValidAdminResult(model: object): model is AdminResult {
  if (isEmptyObject(model)) {
    return false;
  }
  return (
    Object.prototype.hasOwnProperty.call(model, 'id') &&
    isValidValue((<AdminResult>model).id) &&
    (<AdminResult>model).id > 0
  );
}

export function objectHasOwnProperty<O, P extends PropertyKey>(
  object: O,
  property: P,
): object is O & Record<P, unknown> {
  return Object.prototype.hasOwnProperty.call(object, property);
}

export function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime(); //Timestamp
  let d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function* generateChunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

export function chunks<T>(arr: T[], n: number): T[][] {
  return [...generateChunks(arr, n)];
}

export const range = (start: number, stop: number) =>
  Array.from({ length: stop - start + 1 }, (_, i) => start + i);

export const b64toBlob = (
  b64Data: string,
  contentType = 'blob',
  sliceSize = 512,
) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

export function intersection(..._res: unknown[]) {
  const result = [];
  let lists;
  /* eslint-disable prefer-rest-params */
  if (arguments.length === 1) {
    lists = arguments[0];
  } else {
    lists = arguments;
  }

  for (let i = 0; i < lists.length; i++) {
    const currentList = lists[i];
    for (let y = 0; y < currentList.length; y++) {
      const currentValue = currentList[y];
      if (result.indexOf(currentValue) === -1) {
        let existsInAll = true;
        for (let x = 0; x < lists.length; x++) {
          if (lists[x].indexOf(currentValue) === -1) {
            existsInAll = false;
            break;
          }
        }
        if (existsInAll) {
          result.push(currentValue);
        }
      }
    }
  }
  return result;
}

export function generateTimeList(steps = ['00', '30']): string[] {
  const times: string[] = [];
  for (let i = 0; i < 24; i++) {
    const AMPM = i >= 12 ? 'PM' : 'AM';
    const time = (i > 12 ? i - 12 : i).toString().padStart(2, '0');

    steps.forEach(item => {
      times.push(time + ':' + item + ' ' + AMPM);
    });
  }
  return times;
}

export function getTimeAsNumberFromGeneratedTime(timeStr: string): {
  hours: number;
  minutes: number;
} {
  const [time, modifier] = timeStr.split(' ');
  // eslint-disable-next-line prefer-const
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
}

export function compareTwoDates(date1: Date, date2: Date) {
  return (
    format(date1, 'yyyy-MM-dd', {
      locale: undefined,
    }) ===
    format(date2, 'yyyy-MM-dd', {
      locale: undefined,
    })
  );
}
export function formatDateToString(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export function downloadLink(value: string, fileName = 'download.pdf') {
  const link = document.createElement('a');
  link.href = value;
  link.download = fileName;
  link.target = '_blank';
  link.click();
}

export function getHexColorWithOpacity(hexColor: string, opacity: number) {
  return hexColor + Math.ceil(opacity * 100);
}

export function getDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hrs = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hrs}:${mins}:${seconds}`;
}

export const formatString = (text: string) => {
  text
    .split(' ')
    .map(word => (isRTL(word) ? '\u202A' : '\u202C') + word)
    .join(' ');
  return text;
};
export function isRTL(str: string) {
  return /[\u0600-\u06FF]+/.test(str);
}
export function formatText<T extends { context: { citations: ICitations[] } }>(
  text: string,
  message?: T,
): string {
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  if (!message?.context) {
    return formattedText.trim();
  }
  // Remove duplicate citations by URL and title
  const uniqueCitations = Array.from(
    new Map(
      message.context.citations.map(item => [item.url + item.title, item]),
    ).values(),
  );

  // Keep track of already replaced citations to prevent duplicate replacements
  const replacedCitations = new Set<string>();

  // Replace text between [ and ] with <a> tags
  formattedText = formattedText.replace(/\[(.*?)\]/g, (match, p1) => {
    const index = Number(p1.replace(/[^0-9]/g, '')) - 1;
    const item = uniqueCitations[index];

    if (!item || replacedCitations.has(item.url + item.title)) {
      return ''; // Ignore and remove duplicate references
    }

    replacedCitations.add(item.url + item.title); // Mark citation as replaced
    const title = item.title;
    const url = item.url;

    // eslint-disable-next-line max-len
    return `<br /><small class="px-1 text-primary"><a target="_blank" href="${url}">${title}</a><i class="link-icon"></i></small>`;
  });

  // Return the formatted text
  return formattedText.trim();
}

export function updateFileName(originalFile: File, newName: string) {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
}
