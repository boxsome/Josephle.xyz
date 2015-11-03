"use strict";
$(document).ready(function() {

  //full menu toggle on mobile
  $(".header__mobile__nav__button, .menu-overlay").click(function() {
    $(".header__mobile__nav").toggleClass("active"); //toggle full menu
    $("body").toggleClass("unscrollable"); //make the full screen non-scrollable
    $("main").toggleClass("menu-active");
  });

});