$(document).ready(function () {
    $("#rotating_image")
        .bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
            // maybe set angle to the correct reward
            $("#rotating_image").removeClass("spin-wheel");
            $("#rotating_image").addClass("wheel-price-position");

            // alert('Animation finished! Your price is!!!');  
        });
});