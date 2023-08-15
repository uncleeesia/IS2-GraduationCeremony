import { analyzer } from "../record/analyzer.js";
let playAudio = document.getElementById("studentNameAudio");
var sideBarData = document.getElementById("sideBarData");
var template = document.getElementsByTagName("template")[0];
var buttonTemplate = template.content.querySelector("button");
var searchBar = document.getElementById("searchBar");
var tempData;
var diplomaName = [];
var studentName = [];
var searchStudent = true;
var localStorageDiploma =
  localStorage.getItem("TempDiploma") ?? "Show All Diploma";
var localStorageStudent =
  localStorage.getItem("TempStudent") ?? "Name Of Recipient";
const permData = {};
var prevCourseBtn = document.getElementById("prevCourseBtn");
var nextCourseBtn = document.getElementById("nextCourseBtn");
var displayOfDiploma = document.getElementById("titleOfDiploma");
var nameOfRecipient = document.getElementById("NameOfRecipient");
var prevStudentBtn = document.getElementById("prevStudentBtn");
var nextStudentBtn = document.getElementById("nextStudentBtn");
var pauseStudentBtn = document.getElementById("pauseStudentBtn");
var preloadedData;
window.addEventListener("load", function () {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../Sheet1.json", true);

  xhr.onload = function () {

    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      var tempInput;
      var isSearchActive = false;
      searchBar.addEventListener("input", function (e) {
        tempInput = e.currentTarget.value.toLowerCase();
        sideBarData.innerHTML = "";
        isSearchActive = true;
        if (searchStudent) {
          loadData(
            data,
            isSearchActive,
            tempInput,
            searchStudent,
            localStorageDiploma
          );
        } else {
          loadData(
            diplomaName,
            isSearchActive,
            tempInput,
            searchStudent,
            localStorageDiploma
          );
        }
      });

      loadData(
        data,
        isSearchActive,
        tempInput,
        searchStudent,
        localStorageDiploma
      );
      permData.data = data;
    } else {
      if (window.location.pathname == "/src/dragNdrop.html") {
        alert("Please update student data in student info tab.");
      } else {
        location.href = "./dragNdrop.html";
      }
    }
    var sidebarBtn = document.getElementById("sidebarBtn");
    let audioPlayback = document.querySelector("audio");
    var audioSrc = localStorage.getItem("TempAudioData");
    const storedArray = JSON.parse(audioSrc);
    const arrayBuffer = new Uint8Array(storedArray).buffer;
    const audioData = new Blob([arrayBuffer], { type: "audio/mp3" });
    audioSrc = URL.createObjectURL(audioData);
    sidebarBtn.addEventListener("click", function () {
      if (
        !document
          .getElementsByClassName("studentName")
          .item(1)
          .getAttribute("startDuration")
      ) {
        analyzer(audioPlayback, audioSrc);
      }
    });
  };
  xhr.send();
  document
    .getElementById("getByDiploma")
    .addEventListener("click", function (e) {
      searchStudent = false;
      loadData(diplomaName, false, "", searchStudent);
    });
  document
    .getElementById("getByStudent")
    .addEventListener("click", function (e) {
      searchStudent = true;
      loadData(permData.data, false, "", searchStudent, localStorageDiploma);
    });

  if (window.location.pathname == "/src/homepage.html") {
    window.addEventListener("loadedData", () => {
      displayOfDiploma.innerHTML = !localStorageDiploma
        ? "Title Of Diploma"
        : localStorageDiploma;

      nameOfRecipient.innerHTML = !localStorageStudent
        ? "Name Of Recipient"
        : localStorageStudent;

      prevCourseBtn.addEventListener("click", function (e) {
        var indexOfLocal = diplomaName.indexOf(localStorageDiploma);
        localStorage.setItem("TempDiploma", diplomaName[indexOfLocal - 1]);
        loadData(
          permData.data,
          false,
          "",
          searchStudent,
          diplomaName[indexOfLocal - 1]
        );
        if (
          diplomaName[indexOfLocal - 1] === undefined ||
          !localStorageDiploma
        ) {
          localStorage.setItem("TempDiploma", diplomaName[0]);
        }
        localStorage.setItem("TempStudent", studentName[1]);

        location.reload();
      });

      nextCourseBtn.addEventListener("click", function (e) {
        var indexOfLocal = diplomaName.indexOf(localStorageDiploma);
        localStorage.setItem("TempDiploma", diplomaName[indexOfLocal + 1]);
        loadData(
          permData.data,
          false,
          "",
          searchStudent,
          diplomaName[indexOfLocal + 1]
        );
        if (diplomaName[indexOfLocal + 1] === undefined) {
          localStorage.setItem(
            "TempDiploma",
            diplomaName[diplomaName.length - 1]
          );
          localStorage.setItem(
            "TempStudent",
            studentName[studentName.length - 1]
          );
        }
        if (!localStorageDiploma) {
          localStorage.setItem("TempDiploma", diplomaName[1]);
        }

        localStorage.setItem("TempStudent", studentName[1]);
        location.reload();
      });

      prevStudentBtn.addEventListener("click", function (e) {
        var indexOfLocal = studentName.indexOf(
          localStorageStudent.toUpperCase()
        );
        localStorage.setItem("TempStudent", studentName[indexOfLocal - 1]);

        if (
          studentName[indexOfLocal - 1] === "Name Of Recipient" ||
          !localStorageStudent ||
          studentName[indexOfLocal - 1] === undefined
        ) {
          localStorage.setItem("TempStudent", studentName[1]);
        }
        location.reload();
      });

      nextStudentBtn.addEventListener("click", function (e) {
        var indexOfLocal = studentName.indexOf(
          localStorageStudent.toUpperCase()
        );

        localStorage.setItem("TempStudent", studentName[indexOfLocal + 1]);

        if (
          studentName[indexOfLocal + 1] === undefined ||
          studentName[indexOfLocal + 1] === "Name Of Recipient"
        ) {
          localStorage.setItem(
            "TempStudent",
            studentName[studentName.length - 1]
          );
        }
        if (!localStorageStudent) {
          localStorage.setItem("TempStudent", studentName[1]);
        }
        location.reload();
      });

      pauseStudentBtn.addEventListener("click", function (e) {
        const parsedData = JSON.parse(localStorage.getItem("TempAudioData"));
        const audioData = new Uint8Array(parsedData);
        if (localStorageStudent == "Name Of Recipient") {
          localStorage.setItem("TempStudent", studentName[1]);
          location.reload();
          setTimeout(() => pauseStudentBtn.click(), 1000);
        } else {
          if (
            !document
              .getElementById("navbarToggleExternalContent10")
              .classList.contains("show")
          ) {
            sidebarBtn.click();
          }
          var indexOfStudent = permData.data.filter(
            (item) => item.Name.toUpperCase() === localStorageStudent
          );

          var duration = getDuration(
            document.getElementById(indexOfStudent[0].id)
          );

          const audioContext = new AudioContext();

          audioContext.decodeAudioData(audioData.buffer, (audioBuffer) => {
            const analyzer = audioContext.createAnalyser();

            const audioSource = audioContext.createBufferSource();
            audioSource.buffer = audioBuffer;
            audioSource.connect(analyzer);
            analyzer.connect(audioContext.destination);

            const bufferLength = analyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            function analyzeAudio() {
              analyzer.getByteTimeDomainData(dataArray);

              requestAnimationFrame(analyzeAudio);
            }

            analyzeAudio();

            audioSource.start(0, duration.start, duration.end - duration.start);
          });
        }
      });
    });
  }
});

function loadData(
  data,
  search = false,
  tempInput = "",
  type = true,
  defaultDiploma = ""
) {
  let total = 0;
  const tempDiploma = ["Show All Diploma"];
  const tempStudent = ["Name Of Recipient"];
  var lastId = 0;
  sideBarData.innerText = "";
  fetch("../preloaded.json")
    .then((response) => response.json())
    .then((preloadedData) => {
      console.log(data)
      data.forEach((e) => {
        tempData = document.importNode(buttonTemplate, true);
        if (type) {
          tempDiploma.push(e.Diploma);
          diplomaName = [...new Set(tempDiploma)];
          if (
            e.Diploma === defaultDiploma ||
            defaultDiploma === "Show All Diploma"
          ) {
            tempData.textContent = e.Name;
            tempData.id = e.id;
            tempData.classList.add("studentName");

            preloadedData.forEach((preload) => {
              if (e.id === preload.studentNo) {
                tempData.setAttribute("startDuration", preload.startTime);
                tempData.setAttribute(
                  "endDuration",
                  preload.startTime + preload.duration
                );
              }
            });

            lastId = e.id;

            tempStudent.push(e.Name.toUpperCase());
            studentName = tempStudent;

            if (search && type) {
              if (search && !e.Name.toLowerCase().includes(tempInput)) {
                tempData.style.display = "none";
              }
            }
            sideBarData.appendChild(tempData);
          }

          total += 1;
          localStorage.setItem("totalStudent", total);
          if (e.id === lastId) {
            document.getElementById(e.id).addEventListener("click", function (e) {
              localStorage.setItem("TempStudent", e.target.innerText);
              localStorage.setItem("TempDuration", JSON.stringify(getDuration(e.target)));
              location.reload();
            });
          }
        } else {
          tempData.textContent = e;
          tempData.id = e;
          if (defaultDiploma) {
            if (search && !e.toLowerCase().includes(tempInput)) {
              tempData.style.display = "none";
            }
          }
          sideBarData.appendChild(tempData);
          document.getElementById(e).addEventListener("click", function (e) {
            loadData(permData.data, false, "", "student", e.target.id);
            localStorage.setItem("TempStudent", studentName[1]);
            localStorage.setItem("TempDiploma", e.target.id);
            location.reload();
          });
        }
      });
      var event = new Event("loadedData");
      window.dispatchEvent(event);
    })
    .catch((error) => {
      console.log("Error:", error);
    });

}

function getDuration(buttonInfo) {
  var start = buttonInfo.getAttribute("startDuration");
  var end = buttonInfo.getAttribute("endDuration");
  return { start: start, end: end };
}

