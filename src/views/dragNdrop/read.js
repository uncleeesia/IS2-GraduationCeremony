var outputDiv = document.getElementById("output");
var sideBarData = document.getElementById("sideBarData");
var template = document.getElementsByTagName("template")[0];
var buttonTemplate = template.content.querySelector("button");
var searchBar = document.getElementById("searchBar");
var tempData;

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
        loadData(data, isSearchActive, tempInput);
      });
      loadData(data, isSearchActive, tempInput);
    }
  };
  xhr.send();
});

function loadData(data, search = false, tempInput = "") {
  data.forEach((e) => {
    tempData = document.importNode(buttonTemplate, true);
    tempData.textContent += e.Name;
    if (search && !e.Name.toLowerCase().includes(tempInput)) {
      tempData.style.display = "none";
    }
    sideBarData.appendChild(tempData);
  });
}
