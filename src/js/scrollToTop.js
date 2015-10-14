/**
 *
 * Created by J on 10/14/2015.
 */
$(document).ready(function() {
  var $scrollToTop = $(".scrollToTop");

  if ($scrollToTop.length > 0) {

    $scrollToTop.click(function() {

      $("html, body").animate({
        scrollTop:0
      },"slow");

      $(this).toggle();

    });

    $(window).scroll(function() {
      if (($(window).scrollTop() !== 0 && !$scrollToTop.is(":visible"))
        || ($(window).scrollTop() === 0 && $scrollToTop.is(":visible")))
          $scrollToTop.toggle();
    });
  }

});
