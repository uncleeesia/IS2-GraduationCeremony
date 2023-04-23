document.addEventListener("DOMContentLoaded", function (e) {
  const buttonComponent = document.querySelector("#addOnComponents");
  fetch("src/views/addOn/addOns.html")
    .then((res) => res.text())
    .then((data) => {
      buttonComponent.innerHTML = data;
      const inputs = buttonComponent.querySelectorAll("input");
      inputs.forEach((input) => {
        input.addEventListener("click", (e) => {
          e.preventDefault();
          var url;
          switch (e.target.id) {
            case "clapBtn":
              url = "../src/asset/audio/among-us.wav";
              break;
            case "bothBtn":
              url = "../src/asset/audio/pew.wav";
              break;
            case "cheerBtn":
              url = "../src/asset/audio/spongebob-fail.wav";
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