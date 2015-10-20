$(document).ready(function() {

  $(".landing__project__overlay").hover(function() {
    var $overlay = $(this).siblings(".landing__project__img");
    $overlay.toggleClass("hovered");
    $(this).toggleClass("hovered");
  }, function() {
    $(this).toggleClass("hovered");
    $(this).siblings(".landing__project__img").toggleClass("hovered");
  });

});