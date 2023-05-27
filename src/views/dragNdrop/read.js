import { analyzer } from "../record/analyzer.js";
var sideBarData = document.getElementById("sideBarData");
var template = document.getElementsByTagName("template")[0];
var buttonTemplate = template.content.querySelector("button");
var searchBar = document.getElementById("searchBar");
var tempData;
var diplomaName = [];
var searchStudent = true;
var localStorageDiploma = localStorage.getItem("TempDiploma");
const permData = {};
var prevCourseBtn = document.getElementById("prevCourseBtn");
var nextCourseBtn = document.getElementById("nextCourseBtn");
var displayOfDiploma = document.getElementById("titleOfDiploma");

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
      displayOfDiploma.innerHTML = !localStorageDiploma
        ? ""
        : localStorageDiploma;
      loadData(
        data,
        isSearchActive,
        tempInput,
        searchStudent,
        localStorageDiploma
      );
      permData.data = data;
    }
    var sidebarBtn = document.getElementById("sidebarBtn");
    let audioPlayback = document.querySelector("audio");
    var audioSrc = localStorage.getItem("TempAudioData");
    const storedArray = JSON.parse(audioSrc);
    const arrayBuffer = new Uint8Array(storedArray).buffer;
    const audioData = new Blob([arrayBuffer], { type: "audio/mp3" });
    audioSrc = URL.createObjectURL(audioData);
    sidebarBtn.addEventListener("click", function () {
      if (!document.getElementById("1").getAttribute("startDuration")) {
        analyzer(audioPlayback, audioSrc);
      }
    });
  };
  xhr.send();

  prevCourseBtn.addEventListener("click", function (e) {
    var indexOfLocal = diplomaName.indexOf(localStorageDiploma);
    localStorage.setItem("TempDiploma", diplomaName[indexOfLocal - 1]);

    if (diplomaName[indexOfLocal - 1] === undefined) {
      localStorage.setItem("TempDiploma", diplomaName[0]);
    }
    location.reload();
  });

  nextCourseBtn.addEventListener("click", function (e) {
    var indexOfLocal = diplomaName.indexOf(localStorageDiploma);
    localStorage.setItem("TempDiploma", diplomaName[indexOfLocal + 1]);

    if (diplomaName[indexOfLocal + 1] === undefined) {
      localStorage.setItem("TempDiploma", diplomaName[diplomaName.length - 1]);
    }
    location.reload();
  });

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
      console.log(localStorageDiploma);
    });
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
  sideBarData.innerText = "";
  data.forEach((e) => {
    tempData = document.importNode(buttonTemplate, true);
    if (type) {
      tempData.textContent += e.Name;
      tempData.id = e.id;
      tempDiploma.push(e.Diploma);
      diplomaName = [...new Set(tempDiploma)];
      if (defaultDiploma && defaultDiploma != "Show All Diploma") {
        if (
          e.Diploma != defaultDiploma ||
          (search && !e.Name.toLowerCase().includes(tempInput))
        ) {
          tempData.style.display = "none";
        }
      }
      sideBarData.appendChild(tempData);
      total += 1;
      localStorage.setItem("totalStudent", total);
      document.getElementById(e.id).addEventListener("click", function (e) {
        location.href = "homepage.html";
      });
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
        localStorage.setItem("TempDiploma", e.target.id);
        location.reload();
      });
    }
  });
}

function playCurrentName(buttonInfo) {
  console.log(buttonInfo.getAttribute("startDuration"));
  console.log(buttonInfo.getAttribute("endDuration"));
}
