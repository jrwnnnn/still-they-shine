const ambient = document.getElementById("ambient") as HTMLAudioElement | null;

if (ambient) {
	ambient.volume = 0.05;
	setTimeout(() => ambient.play(), 30000);
}
