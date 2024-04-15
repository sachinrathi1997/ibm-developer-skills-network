window.addEventListener('load', function (event) {
    // window.localStorage.clear();
    document.getElementById("convert").addEventListener("click", convertText);
    loadHistory();
});

function convertText(e) {
    e.preventDefault();
    if (document.getElementById('inputText').value) {

        var inputTextValue = parseInt(document.getElementById('inputText').value);
        if (typeof inputTextValue === 'number') {
            var convertedText = inputTextValue * (9 / 5) + 32
            document.getElementById('outputText').value = convertedText;
            storeConversionInHistory(inputTextValue, convertedText);
            loadHistory();

        }
    }

}

function loadHistory() {
    let existingObject = window.localStorage.getItem("conversionHistory");
    if (existingObject) {
        existingObject = JSON.parse(existingObject);
        historyElements = '';
        existingObject.forEach(element => {
            historyElements += `<li class="list-group-item">${element.c} °C = ${element.f} °F</li>`
        });
        document.getElementById("history").innerHTML = historyElements;
    }
}

function storeConversionInHistory(inputTextValue, convertedText) {
    let existingObject = window.localStorage.getItem("conversionHistory");
    if (existingObject)
        existingObject = JSON.parse(existingObject);
    else
        existingObject = []

    existingObject.unshift({ c: inputTextValue, f: convertedText })
    existingObject = existingObject.slice(0, 3);
    window.localStorage.setItem("conversionHistory", JSON.stringify(existingObject));
}

