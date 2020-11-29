import { URL } from 'url';
import querystring from 'querystring';
import { RequestParams } from '../types';

export const parseUrl = (
  url: string,
  params?: RequestParams
): {
  hostname: string;
  path: string;
} => {
  const urlData = new URL(url);

  let path = urlData.pathname;
  if (params) {
    path += '?' + querystring.encode(params);
  }

  return {
    hostname: urlData.hostname,
    path,
  };
};
