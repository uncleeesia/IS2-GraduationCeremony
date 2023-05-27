let diplomaName = localStorage.getItem("diplomaName");
let btnStart = document.getElementById("btnStart");
let btnStop = document.getElementById("btnStop");
let btnDelete = document.getElementById("btnDelete");
let btnEdit = document.getElementById("btnEdit");
let audioPlayback = document.querySelector("audio");
let playAudio = document.getElementById("audioPlay");

let audioIN = { audio: true };

navigator.mediaDevices
  .getUserMedia(audioIN)
  .then(function (mediaStreamObj) {
    let mediaRecorder = new MediaRecorder(mediaStreamObj);

    btnStart.addEventListener("click", function (ev) {
      mediaRecorder.start();
      btnStop.removeAttribute("disabled");
    });
    
    btnDelete.addEventListener("click", function (ev) {
      localStorage.clear();
      location.reload();
    });

    btnStop.addEventListener("click", function (ev) {
      mediaRecorder.stop();
      btnStop.toggleAttribute("disabled");
    });

    mediaRecorder.ondataavailable = function (ev) {
      dataArray.push(ev.data);
    };

    let dataArray = [];

    mediaRecorder.onstop = function (ev) {
      let audioData = new Blob(dataArray, { type: "audio/mp3;" });
      dataArray = [];
      let audioSrc = window.URL.createObjectURL(audioData);
      var reader = new FileReader();

      playAudio.src = audioSrc;

      reader.onload = function (e) {
        console.log(e.target.result);
        audioSrc = window.URL.createObjectURL(audioData);
        playAudio.src = audioSrc;
        localStorage.setItem(
          "TempAudioData",
          JSON.stringify(Array.from(new Uint8Array(e.target.result)))
        );
        if (!btnStart.hasAttribute("disabled")) {
          btnStart.toggleAttribute("disabled");
          btnStart.classList.add("invisible");
          btnStop.classList.add("invisible");
          btnDelete.classList.remove("invisible");
          btnEdit.classList.remove("invisible");
        }
        let downloadAudio = document.createElement("a");
        downloadAudio.href = audioSrc;
        downloadAudio.download = `graudationCeremony_${diplomaName}.mp3`;
        downloadAudio.click();
      };
      reader.readAsArrayBuffer(audioData);
    };
  })
  .catch(function (err) {
    console.log(err.name, err.message);
  });
