var fileInput = document.getElementById("file-input");
var dragNdrop = document.getElementById("dragNdrop");

function downloadFile(filename, content) {
  var link = document.createElement("a");
  link.href =
    "data:application/json;charset=utf-8," + encodeURIComponent(content);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
dragNdrop.addEventListener(
  "drop",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragNdrop.classList.remove("active");
    let draggedData = e.dataTransfer;
    let file = draggedData.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });
      var sheetNameList = workbook.SheetNames;

      sheetNameList.forEach(function (y) {
        var worksheet = workbook.Sheets[y];
        var json = XLSX.utils.sheet_to_json(worksheet);
        downloadFile(y + ".json", JSON.stringify(json));
      });
    };

    reader.readAsArrayBuffer(file);
  },
  false
);

fileInput.addEventListener("change", function (e) {
  var file = e.target.files[0];
  var reader = new FileReader();

  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: "array" });
    var sheetNameList = workbook.SheetNames;

    sheetNameList.forEach(function (y) {
      var worksheet = workbook.Sheets[y];
      var json = XLSX.utils.sheet_to_json(worksheet);
      downloadFile(y + ".json", JSON.stringify(json));
    });
  };

  reader.readAsArrayBuffer(file);
});

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
