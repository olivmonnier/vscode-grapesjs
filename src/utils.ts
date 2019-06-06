export function debounced(delay: number, fn: Function) {
	console.log(11)
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
