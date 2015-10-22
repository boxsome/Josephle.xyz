/**
 *
 * Created by J on 10/16/2015.
 *
 * Hide header on scroll down, show on scroll up or when scrolling is done
 *
 *
 */
'use strict';
$(document).ready(function() {
  var headerToggled = false,
    scrollTimeout,
    curPos = $(window).scrollTop(),
    $header = $(".header"),
    scrollThreshold = $header.height() + parseInt($("main").css("padding-top").replace("px", "")),
    delay = 1000;


  function handleScroll() {
    //scroll down

    //scroll up

  }

  function toggleStickyHeader() {
    //$header.toggleClass("hidden", false).toggleClass("fixed");
    $header.toggleClass("fixed");
    $("main").css("margin-top", "70px");
    $header.css("height", "70px");
    headerToggled = true;
  }

  $(window).scroll(function() {
    //we want to handle scroll down immediately
    var newPos = $(window).scrollTop();
    if (!headerToggled && (curPos > newPos || $(window).scrollTop() + $(window).height() >= $(document).height())) { //scroll up or hit bottom
      toggleStickyHeader();
      clearTimeout(scrollTimeout);
    }
    else if (($header.is(".fixed") || $header.is(".hidden")) && newPos === 0) {
      $header.toggleClass("hidden", false).toggleClass("fixed", false);
      $("main").css("margin-top", "");
      headerToggled = false;
      $header.css("height", "");
    }
    else if (curPos < newPos) {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      $header.toggleClass("fixed", false);
      $("main").css("margin-top", "");
      headerToggled = false;
      scrollTimeout = setTimeout(toggleStickyHeader, delay);
    }
    curPos = newPos;
  });


});
