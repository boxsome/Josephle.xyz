"use strict";
$(document).ready(function() {

  //full menu toggle on mobile
  $("button.header__nav__mobile__menu").click(function() {
    $(this).toggle(); //hide button
    $(".header-menu-mobile").toggle(); //toggle full menu
    $("body").css("overflow", "hidden"); //make the full screen non-scrollable
  });

  //full menu close on mobile
  $(".header-menu-mobile__close").click(function(){
    $(".header-menu-mobile").toggle(); //hide menu
    $("button.header__nav__mobile__menu").toggle(); //show menu button again
    $("body").css("overflow", ""); //make the body scrollable again
  })
});