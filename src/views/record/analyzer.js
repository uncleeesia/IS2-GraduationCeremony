export function analyzer(audioType, audioSrc = "") {
  let totalStudent = localStorage.getItem("totalStudent");
  let studentNo = 1;

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

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += Math.abs(dataArray[i] - 128);
    }
    const averageAmplitude = sum / bufferLength;

    const silenceThreshold = 2;

    if (averageAmplitude < silenceThreshold) {
      if (startTime !== 0) {
        const endTime = audioElement.currentTime;
        const duration = endTime - startTime;
        console.log(`Silence detected! Duration: ${endTime - duration} seconds`);

        let studentName = document.getElementById(studentNo);

        studentName.setAttribute("startDuration", endTime - duration);
        studentName.setAttribute("endDuration", endTime);

        studentNo += 1;
        if (studentNo > totalStudent) {
          clearInterval(intervalId);
        }
      }
      startTime = 0;
    } else {
      if (startTime === 0) {
        startTime = audioElement.currentTime;
      }
    }
  }

  const intervalId = setInterval(checkForSilence, 110);
  audioType = "";
}
