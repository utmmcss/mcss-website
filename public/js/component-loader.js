function sendRequest(url, cb) {
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {

        cb(Http.responseText);

    }
}

sendRequest('/components/nav.html', function (html) {
    if (html.length && document.getElementById('nav-holder')) {
        document.getElementById('nav-holder').outerHTML = html
    }
})

sendRequest('/components/footer.html', function (html) {
    if (html.length && document.getElementById('footer-holder')) {
        document.getElementById('footer-holder').outerHTML = html
    }
})


