const ambient = document.getElementById("ambient") as HTMLAudioElement | null;

if (ambient) {
	ambient.volume = 0.1;
	setTimeout(() => ambient.play(), 5000);
}
