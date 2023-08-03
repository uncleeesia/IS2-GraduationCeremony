let diplomaName = localStorage.getItem("diplomaName");
let btnStart = document.getElementById("btnStart");
let btnStop = document.getElementById("btnStop");
let btnDelete = document.getElementById("btnDelete");
let btnSelectStudent = document.getElementById("btnSelectStudent");
let btnSave = document.getElementById("btnSave");
let btnNewAudio = document.getElementById("btnNewAudio");
let audioPlayback = document.querySelector("audio");
let playAudio = document.getElementById("audioPlay");
let edittedAudio = document.getElementById("audioTemp");
let recordingInProgress = true;
let audioIN = { audio: true };

navigator.mediaDevices
  .getUserMedia(audioIN)
  .then(function (mediaStreamObj) {
    let mediaRecorder = new MediaRecorder(mediaStreamObj);

    btnStart.addEventListener("click", function (ev) {
      mediaRecorder.start();
      localStorage.removeItem("newRecordedAudio");
      btnStop.removeAttribute("disabled");
    });

    btnDelete.addEventListener("click", function (ev) {
      localStorage.clear();
      location.reload();
    });

    btnSelectStudent.addEventListener("click", function (ev) {
      sidebarBtn.click();
    });

    btnSave.addEventListener("click", function (ev) {
      
      const tempDuration = localStorage.getItem("TempDuration");
      const originalAudioDataString = localStorage.getItem("TempAudioData");
      const newRecordedAudioDataString =
        localStorage.getItem("newRecordedAudio");

      const originalAudioData = JSON.parse(originalAudioDataString);
      const newRecordedAudioData = JSON.parse(newRecordedAudioDataString);

      const Fs = 6084.27272727;

      const totalSamples = originalAudioData.length;

      const startSample = Math.min(Fs * tempDuration.start, totalSamples);
      const endSample = Math.min(Fs * tempDuration.end, totalSamples); 

      for (let i = startSample; i < endSample; i++) {
        originalAudioData[i] = newRecordedAudioData[i - startSample];
      }
      console.log(originalAudioData);
      console.log(newRecordedAudioData);

      const updatedAudioDataJSON = JSON.stringify(originalAudioData);

      localStorage.setItem("TempAudioData", updatedAudioDataJSON);

      localStorage.removeItem("TempDuration");
      localStorage.removeItem("newRecordedAudio");
    });

    btnNewAudio.addEventListener("click", function (ev) {
      var result = confirm(`
      Click OK to start recording
      `);
      if (result) {
        edittedAudio.classList.remove("invisible");
        btnStart.classList.remove("invisible");
        btnStart.removeAttribute("disabled");
        btnStop.classList.remove("invisible");
      }

      // prompt user to record the audio
      //  on stop (done)
      //    - add audio data into localstorage as newRecordedAudio
      //    - use existing audio element and add in new audio src from localstorage (newRecordedAudio)
      //  on delete (dun need replace audio with start recording)
      //    - clear localstorage (newRecordedAudio)
      //    - allow user to record again
      //  on save
      //    - merge the new audio into main audio
      //    - replace value of main audio in localstorage (tempAudioData)
      //    - trigger save file process
      //    - update user details eg JSON file
      //    - clear localstorage (newRecordedAudio, tempDuration)
      //  return to normal state (before user was able to record new temp audio)
    });

    btnStop.addEventListener("click", function (ev) {
      mediaRecorder.stop();
      btnStop.toggleAttribute("disabled");
      recordingInProgress = false;
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

      reader.onload = function (e) {
        audioSrc = window.URL.createObjectURL(audioData);
        if (localStorage.getItem("TempDuration")) {
          edittedAudio.src = audioSrc;
          localStorage.setItem(
            "newRecordedAudio",
            JSON.stringify(Array.from(new Uint8Array(e.target.result)))
          );
        } else {
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
            btnSelectStudent.classList.remove("invisible");
            btnSave.classList.remove("invisible");
            btnNewAudio.classList.remove("invisible");
          }
          let downloadAudio = document.createElement("a");
          downloadAudio.href = audioSrc;
          downloadAudio.download = `graudationCeremony.mp3`;
          downloadAudio.click();
        }
      };
      reader.readAsArrayBuffer(audioData);
    };
  })
  .catch(function (err) {
    console.log(err.name, err.message);
  });
