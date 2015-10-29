/**
 *
 *
 * Created by J on 10/22/2015.
 */

$(document).ready(function() {
  var $projectPage = $(".project"),
      $projectDesc, $projectImg,
      descOffset = 100;

  if ($projectPage.length > 0) {
    $projectDesc = $(".project__meta");
    $projectImg = $(".project__img:nth-last-of-type(1)"),
    imgTop = $projectImg.offset().top,
    //check if project description would exceed main wrapper
    $(window).scroll(function() {
      if ($(window).width() <= 1200) return;

      if (!$projectDesc.is(".relative") && $projectImg.outerHeight() + $projectImg.position().top <= $projectDesc.offset().top + $projectDesc.outerHeight()) {
        $projectDesc.toggleClass("relative");
        $projectDesc.css("top", ( (imgTop + $projectImg.outerHeight()) - ($projectDesc.outerHeight() + descOffset)) + "px");
        $(".project__img:nth-of-type(1)").css("margin-left", "30px");
      }
      else if ($projectDesc.is(".relative") && $(window).scrollTop() + descOffset < $projectDesc.offset().top) {
        $projectDesc.toggleClass("relative");
        $projectDesc.css("top", "");
        $(".project__img:nth-of-type(1)").css("margin-left", "");
      }

    });
  }

});
