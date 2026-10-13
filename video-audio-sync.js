(() => {
  "use strict";

  const video = document.getElementById("akra-video");
  const audio = document.getElementById("akra-voice");
  const status = document.getElementById("akra-audio-status");
  if (!video || !audio || !status) return;

  video.muted = true;
  video.volume = 0;
  audio.volume = 1;

  function syncTime(source, target) {
    if (Number.isFinite(source.currentTime) && Math.abs(source.currentTime - target.currentTime) > 0.35) {
      target.currentTime = source.currentTime;
    }
  }

  function playMedia(source, target) {
    syncTime(source, target);
    target.playbackRate = source.playbackRate;
    const result = target.play();
    if (result && typeof result.catch === "function") {
      result.catch(() => {
        status.textContent = "La lecture de la voix a échoué. Vérifiez le son de l’appareil et réessayez.";
      });
    }
  }

  video.addEventListener("play", () => playMedia(video, audio));
  audio.addEventListener("play", () => playMedia(audio, video));
  video.addEventListener("pause", () => {
    if (!video.ended) audio.pause();
  });
  audio.addEventListener("pause", () => {
    if (!audio.ended) video.pause();
  });

  video.addEventListener("seeking", () => syncTime(video, audio));
  audio.addEventListener("seeking", () => syncTime(audio, video));
  video.addEventListener("ratechange", () => {
    audio.playbackRate = video.playbackRate;
  });
  audio.addEventListener("ratechange", () => {
    video.playbackRate = audio.playbackRate;
  });
  video.addEventListener("timeupdate", () => {
    if (!audio.paused) syncTime(video, audio);
  });
  audio.addEventListener("timeupdate", () => {
    if (!video.paused) syncTime(audio, video);
  });
  video.addEventListener("ended", () => audio.pause());
  audio.addEventListener("ended", () => video.pause());

  for (const media of [video, audio]) {
    media.addEventListener("error", () => {
      status.textContent = "Impossible de charger le média. Vérifiez que les deux fichiers sont bien publiés avec le site.";
    });
  }
})();
