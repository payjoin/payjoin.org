export function clickOutside(node: Node, cb: () => void) {
	function onClick(event: MouseEvent) {
		if (!node.contains(event.target as Node)) {
			cb();
		}
	}
	document.body.addEventListener('click', onClick);
	return {
		update(newCb: () => void) {
			cb = newCb;
		},
		destroy() {
			window.removeEventListener('click', onClick);
		}
	};
}
