$(document).ready(function () {
    $("#rotating_image")
        .bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
            // maybe set angle to the correct reward
            $("#rotating_image").removeClass("spin-wheel");
            $("#rotating_image").addClass("wheel-price-position");

            // alert('Animation finished! Your price is!!!');  
        });
});

$(document).bind('DOMSubtreeModified', function () {

    if ($("#rotating_image") != undefined && $("#rotating_image").length > 0) {
        console.log("Rotating image was created!!!!");
        $("#rotating_image")
        .bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
            // TODO: Add here price board content
            $("#price-content").html("YOU WON 500 MB FREE INTERNET!!!");
        });
    }
})