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