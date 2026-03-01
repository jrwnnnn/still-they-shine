import {seededRandom} from "@utils/random";

function centerBiased(seed: number): number {
	const r1 = seededRandom(seed);
	const r2 = seededRandom(seed + 127);
	const r3 = seededRandom(seed + 311);
	return (r1 + r2 + r3) / 3;
}

export function setPosition(seed: number): { x: number; y: number } {
	const rawX = centerBiased(seed);
	const rawY = centerBiased(seed + 571);
	return {
		x: 5 + rawX * 90,
		y: 5 + rawY * 90,
	};
}
