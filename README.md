# node-https

A simple http request client module based on Node.js `https` module

## Notice

- Only supports `multipart/form-data` and `application/json` content type
- Does not support http redirects(301, 302) handling

## Installation

```bash
npm i node-https
```

## Useabe

_typescript example_

```typescript
import { Http, HttpRequestOptions, Method } from '@node-https';

// ...

const http = new Http();

app.get('/', async (req: Request, res: Response) => {
  const options: HttpRequestOptions = {
    headers: {
      token: '1-2-3-4',
    },
    params: {
      key: 'hello',
    },
  };

  try {
    const result = await http.get(url, options);
    res.status(result.status).json(result.data ?? { body: result.body });
  } catch (e) {
    res.status(e.status || 500).json(e.data);
  }
});
```

## Tips

1. If send `form` type request, the field `value` which is `base64` encoded
   image will convert to file item automaticlly, for example

```typescript
// form format data:
[
  {
    field: 'id',
    value: 'avatar',
  },
  {
    field: 'image',
    value: 'data:image/png;base64,xxxxxxxxxxxxx',
  },
];

// will convert to
[
  {
    field: 'id',
    value: 'avatar',
  },
  {
    field: 'image',
    file: FileData,
  },
];
```

2. It supports force to submit a json data as form type, for example:

```typescript
Http.post(
  'url',
  {
    id: 'avatar',
    image: 'data:image/png;base64,xxxxxxxxxxxxx',
  },
  { form: true }
);
```

## Interfaces / Types

```typescript
type Method = 'POST' | 'GET' | 'PUT' | 'DELETE';
type Params = { [key: string]: any };

type JsonDataType = { [key: string]: any } | [];
type FormDataType = {
  field: string;
  value?: string;
  file?: {
    buffer: Buffer;
    filename: string;
  };
}[];
```

### HttpResponse

```typescript
interface HttpResponse {
  status: number;

  // when http response body is JSON string format
  data?: { [key: string]: any };

  // when http response body is **NOT** JSON string format
  body?: string;
}
```

### HttpRequestOptions

```typescript
interface HttpRequestOptions {
  hostname?: string;
  port?: number;
  path?: string;
  method?: Method;
  form?: boolean;
  headers?: { [key: string]: any };
  params?: Params;
  data?: JsonDataType | FormDataType;
}
```

### HttpOptions

```typescript
interface HttpOptions {
  headers?: { [key: string]: string };
  params?: Params;
}
```

### HttpPostOptions

```typescript
interface HttpPostOptions extends HttpOptions {
  form?: boolean;
}
```

## Methods

### get

```typescript
get(url: string, options?: HttpOptions): Promise<HttpResponse>
```

### put

```typescript
put(
  url: string,
  data?: JsonDataType,
  options?: HttpOptions
): Promise<HttpResponse>
```

### post

```typescript
post(
  url: string,
  data?: JsonDataType | FormDataType,
  options?: HttpPostOptions
): Promise<HttpResponse>
```

### delete

```typescript
delete(url: string, options?: HttpOptions): Promise<HttpResponse>
```

### porp

`put` or `post`

```typescript
porp(
  method: 'PUT' | 'POST',
  url: string,
  data?: JsonDataType,
  options?: HttpOptions
): Promise<HttpResponse>
```

### Request

```typescript
request(
  url: string,
  method: Method,
  options?: HttpRequestOptions
): Promise<HttpResponse>
```
