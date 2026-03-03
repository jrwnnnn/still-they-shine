// !FIX Buggy zoom

import type { PanzoomObject } from "@panzoom/panzoom";

export function focusStar(panzoom: PanzoomObject, starId: string | number) {
	const wrapper = document.getElementById(String(starId))?.parentElement;
	if (!wrapper) return;

	const scale = 1;
	const canvas = wrapper.parentElement!;

	const panX =
		(window.innerWidth / 2 - canvas.offsetWidth / 2) / scale -
		wrapper.offsetLeft +
		canvas.offsetWidth / 2;
	const panY =
		(window.innerHeight / 2 - canvas.offsetHeight / 2) / scale -
		wrapper.offsetTop +
		canvas.offsetHeight / 2;

	panzoom.setOptions({ contain: undefined });

	panzoom.zoom(scale, { animate: true, duration: 500 });
	panzoom.pan(panX, panY, { animate: true, duration: 500, force: true });

	setTimeout(() => {
		panzoom.setOptions({ contain: "outside" });
	}, 500);
}
