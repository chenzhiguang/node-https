import {
  RequestForm,
  HttpOptions,
  HttpPostOptions,
  HttpResponse,
  RequestJson,
} from './types';
import { Request } from './request';

export class Http extends Request {
  constructor() {
    super();
  }

  porp(
    method: 'PUT' | 'POST',
    url: string,
    data?: { [key: string]: any },
    options?: HttpPostOptions
  ): Promise<HttpResponse> {
    return this.request(url, method, { ...options, data });
  }

  get(url: string, options?: HttpOptions): Promise<HttpResponse> {
    return this.request(url, 'GET', options);
  }

  post(
    url: string,
    data?: RequestJson | RequestForm,
    options?: HttpPostOptions
  ): Promise<HttpResponse> {
    return this.porp('POST', url, data, options);
  }

  put(
    url: string,
    data?: RequestJson,
    options?: HttpOptions
  ): Promise<HttpResponse> {
    return this.porp('PUT', url, data, options);
  }

  delete(url: string, options?: HttpOptions): Promise<HttpResponse> {
    return this.request(url, 'DELETE', options);
  }
}
