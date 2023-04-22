var loadButton = document.getElementById('load-button');
var outputDiv = document.getElementById('output');

loadButton.addEventListener('click', function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'sheet1.json', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            //get the individual data 
            outputDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }
    };
    xhr.send();
});