/* eslint-disable max-len */
const HTTP_VALIDATOR =
  /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
const TELEGRAM_VALIDATOR = /^(https:\/\/)?t\.me\/[\S]+$/;

export function validateLink(link: any, type: string): boolean {
  if (type === 'http') return HTTP_VALIDATOR.test(link);
  if (type === 'telegram') return TELEGRAM_VALIDATOR.test(link);

  return false;
}
