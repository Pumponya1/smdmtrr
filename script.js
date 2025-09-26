document.getElementById("loveButton").addEventListener("click", () => {
  const arrow = document.getElementById("arrow");
  const song = document.getElementById("loveSong");

  // Двигаем стрелку к верхнему уровню
  arrow.style.top = "0%";

  // Запускаем музыку
  song.play();
});
