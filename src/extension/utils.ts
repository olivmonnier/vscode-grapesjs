export function debounced(delay: number, fn: Function) {
  let timerId: any;
  return function(...args: any[]) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

export function getNestedObject(nestedObj: any, pathArr: Array<string>) {
  return pathArr.reduce(
    (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
    nestedObj
  );
}

export function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function isURL(str: string) {
  const urlRegex = '^(?:http|https|ftp)://';
  const url = new RegExp(urlRegex, 'i');
  return url.test(str);
}
