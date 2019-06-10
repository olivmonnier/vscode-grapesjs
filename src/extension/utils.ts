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
