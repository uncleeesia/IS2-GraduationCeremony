document.addEventListener("DOMContentLoaded", function (e) {
  e.preventDefault();

  const buttonComponent = document.querySelector("#addOnComponents");
  fetch("./views/addOn/addOns.html")
    .then((res) => res.text())
    .then((data) => {
      buttonComponent.innerHTML = data;
      const inputs = buttonComponent.querySelectorAll("input");
      inputs.forEach((input) => {
        input.addEventListener("click", (e) => {
          var url;
          switch (e.target.id) {
            case "clapBtn":
              url = "./asset/audio/among-us.wav";
              break;
            case "bothBtn":
              url = "./asset/audio/pew.wav";
              break;
            case "cheerBtn":
              url = "./asset/audio/spongebob-fail.wav";
              break;
          }
          loadAudio(url);
        });
      });
    });
});

function loadAudio(url) {
  const audioContext = new AudioContext();
  const audio = new Audio(url);
  const track = audioContext.createMediaElementSource(audio);
  track.connect(audioContext.destination);
  audio.play();
}
