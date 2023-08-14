export function clickOutside(node: Node, cb: () => void) {
	function onClick(event: MouseEvent) {
		if (!node.contains(event.target as Node)) {
			console.log({ node }, event.target);
			console.log('does not contain', !node.contains(event?.target as Node));
			// node.dispatchEvent(new CustomEvent('clickoutside', { detail: node }));
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
