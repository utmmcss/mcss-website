$(document).ready(function () {

    $.get('/components/nav.html', function (html) {
        $('#nav-holder').html(html)
    })

    $.get('/components/footer.html', function (html) {
        $('#footer-holder').html(html)
    })

});