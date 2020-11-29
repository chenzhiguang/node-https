import FormData from 'form-data';
import { request, RequestOptions } from 'https';
import { makeFormDate } from './helpers/makeFormDate';
import { parseResponse } from './helpers/parseResponse';
import { parseUrl } from './helpers/parseUrl';
import { HttpRequestOptions, Method, HttpResponse } from './types';

export class Request {
  // TODO: support before/after filters
  constructor() {}

  request(
    url: string,
    method: Method,
    options?: HttpRequestOptions
  ): Promise<HttpResponse> {
    options = { ...options };
    const isForm = options.form === true;
    const hasData = (method === 'POST' || method === 'PUT') && options.data;

    let { headers = {} } = options;
    let data: string;
    let form: FormData;

    if (hasData) {
      if (isForm) {
        form = makeFormDate(options.data);
        headers = { ...headers, ...form.getHeaders() };
      } else {
        data = JSON.stringify(options.data);
        headers['Content-Type'] = 'application/json';
      }
    }
    // NOTE: is header 'Content-Length': data.length needed?

    const requestOptions: RequestOptions = {
      ...parseUrl(url, options.params),
      port: options.port,
      method,
      headers,
    };

    return new Promise((resolve, reject) => {
      const req = request(requestOptions, (res: any) => {
        const status = res.statusCode;
        let body = '';

        res.on('data', (chunk: any) => {
          body += chunk;
        });

        res.on('end', () => {
          const result: HttpResponse = parseResponse(status, body);
          if (status >= 200 && status < 300) {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });

      req.on('error', (error: any) => {
        reject({
          status: 500,
          data: {
            code: 'https_system_error',
            error,
          },
        });
      });

      if (hasData) {
        if (isForm) {
          form.pipe(req);
        } else {
          req.write(data);
        }
      }

      req.end();
    });
  }
}
