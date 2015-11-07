/**
 *
 * Created by J on 11/4/2015.
 */

$(document).ready(function() {
  var $contentOverlay = $(".content-overlay");

  //set overlay height if on project page
  //$contentOverlay.height($(document).outerHeight());

  $contentOverlay.click(function() {
    var $imgFull = $(".modal-image"),
        $mobileMenuActive = $(".header__mobile__nav.active");

    if ($imgFull.length > 0) {
      $imgFull.remove();
      $(".header").toggleClass("hidden");
    }
    else if ($mobileMenuActive.length > 0) {
      $mobileMenuActive.toggleClass("active");
    }

    $("body").toggleClass("unscrollable"); //make the full screen non-scrollable
    $(".content-overlay").toggleClass("active");

  });

});
