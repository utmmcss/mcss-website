$(document).ready(function () {

    function updateScroll(position) {
        console.log(position)

        switch (position) {
            case 'body': // Body

                $('#main-nav').removeClass('nav-top');
                $('#main-nav').addClass('nav-active');




                break;
            default: // Top (Docked)
                $('#main-nav').addClass('nav-top');
                $('#main-nav').removeClass('nav-active');


                break;
        }
    };

    var wp = new Waypoint({
        element: document.getElementById('cover'),
        handler: function(direction) {
            updateScroll(direction == 'down' ? 'body' : 'top');
        },
        offset: '-20%'
    })

    updateScroll('top');
});

$("#toggle-navbar").on("click",function(){
    toggleOverlay();
});

$('a.overlayLink').click(function () {
    toggleOverlay();
});

function toggleOverlay() {
    $("#navham").toggleClass("is-active");
    if($("#navham").hasClass("is-active")){
        openOverlay();
    } else{
        closeOverlay();
    }
}

function openOverlay() {
    $(".overlay").css({top: "0"});
    $("html").css({"overflow-y": "hidden"});
}

function closeOverlay() {
    $("#navham").removeClass("is-active");
    $(".overlay").css({top: "-100%"});
    $("html").css({"overflow-y": "visible"});
}