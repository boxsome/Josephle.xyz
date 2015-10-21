$(document).ready(function() {

  var $landingPage = $("main.landing"),
      $landingThumbnails;

  if ($landingPage.length > 0) { //check if we're on the landing page

    $(".landing__project__overlay").hover(function () {
      var $overlay = $(this).siblings(".landing__project__img");
      $overlay.toggleClass("hovered");
      $(this).toggleClass("hovered");
    }, function () {
      $(this).toggleClass("hovered");
      $(this).siblings(".landing__project__img").toggleClass("hovered");
    });

    //add retina for thumbnails
    if (isHighDensity()) {
      $landingThumbnails = $landingPage.find(".landing__project__img");
      $landingThumbnails.css("background-image", $(this).css("background-image").replace("thumbnail", "thumbnail_2x"));
    }
  }
});