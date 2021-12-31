// Examples

import express, { Application, Request, Response } from 'express';
import { Http, HttpRequestOptions, Method } from './index';
import { formbody } from 'formbody';

const app: Application = express();
app.use(express.json());
app.use(formbody);

const http = new Http();

app.all('/', async (req: Request, res: Response) => {
  const url = req.query.url?.toString();
  const port = req.query.port?.toString();
  const headers: { [key: string]: any } = {};

  // NOTE: Here I only fetch a few header fields for testing purpose
  if (req.headers.token) {
    headers.token = req.headers.token;
  }
  if (req.headers.mst) {
    headers.mst = req.headers.mst;
  }

  const options: HttpRequestOptions = {
    headers: headers,
    data: req.body,
    form: !!req.is('multipart/form-data'),
  };

  if (port) {
    options.port = port;
  }

  if (!url || false === /^https?:/.test(url)) {
    return res.status(400).json({ code: 'url_param_missing' });
  }

  try {
    const result = await http.request(url, req.method as Method, options);
    res.status(result.status).json(result);
  } catch (e) {
    res.status(e.status || 500).json(e.data);
  }
});

app.listen(3090, () => {
  console.log('Node server is listening on localhost:3090');
});
