import { analyzer } from "../record/analyzer.js";

var fileInput = document.getElementById("file-input");
var dragNdrop = document.getElementById("dragNdrop");
var audioSrc = localStorage.getItem("TempAudioData");

window.addEventListener("DOMContentLoaded", function (e) {
  e.preventDefault;
  if (window.location.pathname == "/src/record.html") {
    btnStart.removeAttribute("disabled");
    btnEdit.addEventListener("click", function (ev) {
      analyzer(playAudio);
    });
  }
  if (audioSrc != null && window.location.pathname == "/src/record.html") {
    const storedArray = JSON.parse(audioSrc);
    const arrayBuffer = new Uint8Array(storedArray).buffer;
    const audioData = new Blob([arrayBuffer], { type: "audio/mp3" });
    playAudio.src = URL.createObjectURL(audioData);
    if (!btnStart.hasAttribute("disabled")) {
      btnStart.toggleAttribute("disabled");
      btnStart.classList.add("invisible");
      btnStop.classList.add("invisible");
      btnDelete.classList.remove("invisible");
      btnEdit.classList.remove("invisible");
    }
  }
  function downloadFile(filename, content) {
    var link = document.createElement("a");
    link.href =
      "data:application/json;charset=utf-8," + encodeURIComponent(content);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  function convertFile(file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      if (file.type.startsWith("audio/")) {
        audioSrc = window.URL.createObjectURL(file);
        playAudio.src = audioSrc;
        localStorage.setItem(
          "TempAudioData",
          JSON.stringify(Array.from(new Uint8Array(reader.result)))
        );
        analyzer(audioPlayback,audioSrc);
        if (!btnStart.hasAttribute("disabled")) {
          btnStart.toggleAttribute("disabled");
          btnStart.classList.add("invisible");
          btnStop.classList.add("invisible");
          btnDelete.classList.remove("invisible");
          btnEdit.classList.remove("invisible");
        }
      } else {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var sheetNameList = workbook.SheetNames;

        sheetNameList.forEach(function (y) {
          var worksheet = workbook.Sheets[y];
          var json = XLSX.utils.sheet_to_json(worksheet);
          downloadFile(y + ".json", JSON.stringify(json));
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }

  fileInput.addEventListener("change", function (e) {
    var file = e.target.files[0];
    convertFile(file);
  });

  dragNdrop.addEventListener(
    "drop",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragNdrop.classList.remove("active");
      let draggedData = e.dataTransfer;
      let file = draggedData.files[0];
      convertFile(file);
    },
    false
  );

  dragNdrop.addEventListener(
    "dragenter",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragNdrop.classList.add("active");
    },
    false
  );

  dragNdrop.addEventListener(
    "dragleave",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragNdrop.classList.remove("active");
    },
    false
  );

  dragNdrop.addEventListener(
    "dragover",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragNdrop.classList.add("active");
    },
    false
  );
});
