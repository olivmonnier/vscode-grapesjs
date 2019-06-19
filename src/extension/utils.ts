export function debounced(delay: number, fn: Function) {
	let timerId: any;
	return function(...args: any[]) {
		if (timerId) {
			clearTimeout(timerId);
		}
		timerId = setTimeout(() => {
			fn(...args);
			timerId = null;
		}, delay)
	}
}

export function getNestedObject(nestedObj: any, pathArr: Array<string>) {
	return pathArr.reduce((obj, key) =>
			(obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}