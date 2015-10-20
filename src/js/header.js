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
  var headerToggled = true,
    scrollTimeout,
    curPos = $(window).scrollTop(),
    $header = $(".header"),
    scrollThreshold = $header.height() + parseInt($("main").css("padding-top").replace("px", ""));


  function handleScroll() {
    //scroll down

    //scroll up

  }

  function toggleStickyHeader() {
    $header.toggleClass("hidden", false).toggleClass("fixed");
    headerToggled = true;
  }

  $(window).scroll(function() {
    //we want to handle scroll down immediately
    var newPos = $(window).scrollTop();
    if (headerToggled && curPos < newPos && newPos > scrollThreshold) { //scroll down past header
      $header.toggleClass("hidden").toggleClass("fixed", false);
      headerToggled = false;
      scrollTimeout = setTimeout(toggleStickyHeader, 2000);
    }
    else if (!headerToggled && (curPos > newPos || $(window).scrollTop() + $(window).height() >= $(document).height())) { //scroll up or hit bottom
      toggleStickyHeader();
      clearTimeout(scrollTimeout);
    }
    else if (($header.is(".fixed") || $header.is(".hidden")) && newPos === 0) {
      $header.toggleClass("hidden", false).toggleClass("fixed", false);
      headerToggled = false;
    }
    else if (scrollTimeout) {
      clearTimeout(scrollTimeout);
      if (!headerToggled) scrollTimeout = setTimeout(toggleStickyHeader, 2000);
    }
    curPos = newPos;
  });


});
