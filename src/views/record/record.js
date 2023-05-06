let diplomaName = localStorage.getItem("diplomaName");
let start = document.getElementById("btnStart");
let stop = document.getElementById("btnStop");
let audio = document.querySelector("audio");
let playAudio = document.getElementById("audioPlay");

let audioIN = { audio: true };

navigator.mediaDevices
  .getUserMedia(audioIN)
  .then(function (mediaStreamObj) {
    let mediaRecorder = new MediaRecorder(mediaStreamObj);

    start.addEventListener("click", function (ev) {
      mediaRecorder.start();
      stop.removeAttribute("disabled");
    });

    stop.addEventListener("click", function (ev) {
      mediaRecorder.stop();
      stop.toggleAttribute("disabled");
    });

    mediaRecorder.ondataavailable = function (ev) {
      dataArray.push(ev.data);
    };

    let dataArray = [];

    mediaRecorder.onstop = function (ev) {
      let audioData = new Blob(dataArray, { type: "audio/mp3;" });
      dataArray = [];

      let audioSrc = window.URL.createObjectURL(audioData);

      playAudio.src = audioSrc;
      let downloadAudio = document.createElement("a");
      downloadAudio.href = audioSrc;
      downloadAudio.download = `graudationCeremony_${diplomaName}.mp3`;
      downloadAudio.click();
    };
  })

  .catch(function (err) {
    console.log(err.name, err.message);
  });
