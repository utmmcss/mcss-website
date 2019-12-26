$(document).ready(function () {

    console.log('Document is loaded!');

    $("#navham").on("click",function(){
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
        $(".overlay").css({left: "0"});

        $("html").css({"overflow-y": "hidden"});
    }

    function closeOverlay() {
        $("#navham").removeClass("is-active");
        $(".overlay").css({left: "-100%"});
        $("html").css({"overflow-y": "visible"});
    }

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
        offset: '-20px'
    })

    updateScroll('top');
});
