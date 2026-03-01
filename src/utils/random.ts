export function seededRandom(seed: number): number {
	const x = Math.sin(seed * 9301 + 49297) * 233280;
	return x - Math.floor(x);
}

export function hashSeed(str: string): number {
	let h = 5381;
	for (let i = 0; i < str.length; i++) {
		h = ((h << 5) + h + str.charCodeAt(i)) | 0;
	}
	return Math.abs(h);
}
