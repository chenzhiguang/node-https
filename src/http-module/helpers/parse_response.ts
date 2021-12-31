import { HttpResponse } from '../types';

// NOTE:
// result.data can only be JSON data.
export const parseResponse = (status: number, body: any): HttpResponse => {
  const result: HttpResponse = { status };

  try {
    const data = JSON.parse(body);

    if (
      data === null ||
      ['boolean', 'number', 'string'].indexOf(typeof data) !== -1
    ) {
      result.body = data;
    } else {
      result.data = data;
    }
  } catch {
    result.body = body;
  }

  return result;
};
