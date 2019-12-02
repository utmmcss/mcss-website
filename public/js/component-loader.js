function sendRequest(url, cb) {
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        cb(Http.responseText);
    }
}

sendRequest('/components/nav.html', function (html) {
    document.getElementById('nav-holder').innerHTML = html
})

sendRequest('/components/footer.html', function (html) {
    document.getElementById('footer-holder').innerHTML = html
})


