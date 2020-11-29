import { HttpResponse } from '../types';

export const parseResponse = (status: number, body: string): HttpResponse => {
  const result: HttpResponse = { status };

  if (!body) {
    result.body = '';
  } else {
    try {
      const json = JSON.parse(body);
      result.data = json;
    } catch {
      result.body = body;
    }
  }

  return result;
};
