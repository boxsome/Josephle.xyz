"use strict";
$(document).ready(function() {

  //full menu toggle on mobile
  $(".header__mobile__nav__button").click(function() {
    $(".header__mobile__nav").toggleClass("active"); //toggle full menu
    $("body").toggleClass("unscrollable"); //make the full screen non-scrollable
    $(".content-overlay").toggleClass("active");
  });

});