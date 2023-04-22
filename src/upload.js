
var fileInput = document.getElementById('file-input');

function downloadFile(filename, content) {
  var link = document.createElement('a');
  link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(content);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

fileInput.addEventListener('change', function(e) {
  var file = e.target.files[0];
  var reader = new FileReader();

  reader.onload = function(e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, {type: 'array'});
    var sheetNameList = workbook.SheetNames;

    sheetNameList.forEach(function(y) {
      var worksheet = workbook.Sheets[y];
      var json = XLSX.utils.sheet_to_json(worksheet);
      downloadFile(y + ".json", JSON.stringify(json));
    });
  };

  reader.readAsArrayBuffer(file);
});