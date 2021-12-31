import { FormbodyItem } from 'formbody';

export type Method = 'POST' | 'GET' | 'PUT' | 'DELETE';
export type RequestParams = { [key: string]: any };
export type RequestJson = { [key: string]: any };
export type RequestForm = FormbodyItem[];

export interface HttpRequestOptions {
  form?: boolean;
  hostname?: string;
  port?: number | string | null;
  path?: string;
  method?: Method;
  headers?: { [key: string]: any };
  params?: RequestParams;
  data?: RequestJson | RequestForm;
}

export interface HttpOptions {
  headers?: { [key: string]: string };
  params?: RequestParams;
}

export interface HttpPostOptions extends HttpOptions {
  form?: boolean;
}

export interface HttpResponse {
  status: number;
  data?: { [key: string]: any };
  body?: string;
}
