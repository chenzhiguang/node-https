import FormData from 'form-data';
import { RequestForm, RequestJson } from '../types';

export const makeFormDate = (data?: RequestForm | RequestJson): FormData => {
  const form = new FormData();

  if (!data && typeof data !== 'object') {
    return form;
  }

  let formData: RequestForm;
  if (data instanceof Array) {
    formData = data as RequestForm;
  } else {
    formData = [];
    for (const field in data) {
      formData.push({
        field,
        value: data[field],
      });
    }
  }

  for (const item of formData) {
    const { field } = item;
    let { file, value } = item;

    if (value) {
      const valueMatch = value.match(/^data:image\/[a-z]+;base64,(.+)$/);
      if (valueMatch) {
        file = {
          buffer: Buffer.from(valueMatch[1], 'base64'),
          filename: Date.now().toString(),
        };
        value = undefined;
      }
    }

    if (value) {
      form.append(field, value);
    } else if (file && file.buffer && file.filename) {
      form.append(field, file.buffer, {
        filename: [
          // NOTE: I am not sure if it is needed to make the filename unique
          Math.random().toString(36).substr(2),
          file.filename,
        ].join('-'),
      });
    }
  }

  return form;
};
