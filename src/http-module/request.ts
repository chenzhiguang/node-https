import FormData from 'form-data';
import { request as httpsRequest, RequestOptions } from 'https';
import { request as httpRequest } from 'http';
import { makeFormDate } from './helpers/make_form_date';
import { parseResponse } from './helpers/parse_response';
import { parseUrl } from './helpers/parse_url';
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

    const parsedUrl = parseUrl(url, options.params);

    const requestOptions: RequestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      port: options.port,
      method,
      headers,
    };

    return new Promise((resolve, reject) => {
      const successHandler = (res: any) => {
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
      };

      const req = parsedUrl.isHttps
        ? httpsRequest(requestOptions, successHandler)
        : httpRequest(requestOptions, successHandler);

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
