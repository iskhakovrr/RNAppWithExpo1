export function debounce(callee, interval, ref) {
	if (ref.current) {
		clearTimeout(ref.current)
	}
	ref.current = setTimeout(() => {
		callee()
	}, interval)
}
