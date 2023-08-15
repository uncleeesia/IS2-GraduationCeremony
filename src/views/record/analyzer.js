export function analyzer(audioType, audioSrc = "") {
  var studentNo = 0;

  var tempDataToJsonFile = [];
  const audioContext = new window.AudioContext();
  const audioElement = audioType;
  const source = audioContext.createMediaElementSource(audioElement);

  const analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 2048;

  source.connect(analyzer);

  if (audioElement.id == "audio" && audioSrc) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0;

    analyzer.connect(gainNode);
    gainNode.connect(audioContext.destination);

    audioElement.src = audioSrc;
    audioElement.playbackRate = 5;
    audioElement.play();
  } else {
    analyzer.connect(audioContext.destination);
  }

  let startTime = 0;

  function checkForSilence() {
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyzer.getByteTimeDomainData(dataArray);

    const silenceThreshold = 1;

    const isSilent = dataArray.every(
      (value) => Math.abs(value - 128) < silenceThreshold
    );

    if (isSilent) {
      if (startTime !== 0) {
        const endTime = audioElement.currentTime;
        const duration = endTime - startTime;
        const startDuration = Math.floor(endTime - duration);
        let studentName = document
          .getElementsByClassName("studentName")
          .item(studentNo);
        tempDataToJsonFile.push({
          studentNo: studentName.id,
          startTime: startDuration,
          duration: JSON.parse((duration + 0.5).toFixed(2)),
        });

        studentNo += 1;
      }
      startTime = 0;
    } else {
      if (startTime === 0) {
        startTime = audioElement.currentTime;
      }
    }
    requestAnimationFrame(checkForSilence);
  }
  const waitForSilence = new Promise((resolve, reject) => {
    const handleSilenceFinished = () => {
      audioElement.removeEventListener("ended", handleSilenceFinished);
      resolve();
    };
    audioElement.addEventListener("ended", handleSilenceFinished);
  });

  checkForSilence();
  audioType = "";
  return waitForSilence.then(() => {
    if (
      window.location.pathname == "/src/record.html" &&
      studentNo == tempDataToJsonFile.length
    ) {
      setTimeout(
        () => saveObjectToJSONFile(tempDataToJsonFile, "preloaded.json"),
        1500
      );
    }
  });
}
function saveObjectToJSONFile(obj, filename) {
  const jsonStr = JSON.stringify(obj);
  const blob = new Blob([jsonStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  link.click();
}
