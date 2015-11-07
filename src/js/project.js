/**
 *
 *
 * Created by J on 10/22/2015.
 */

$(document).ready(function() {
  var $projectPage = $(".project"),
      $projectDesc, $projectImg,
      descOffset = 100,
      mobileWidth = 800,
      $footer = $(".footer"),
      $header = $(".header");

  if ($projectPage.length > 0) {
    $projectDesc = $(".project__meta");
    //check if project description would exceed main wrapper
    $(window).scroll(function() {
      if ($(window).width() <= 1200) return;

      if (!$projectDesc.is(".relative") && $footer.position().top <= $projectDesc.offset().top + $projectDesc.outerHeight()) {
        $projectDesc.toggleClass("relative");
        $projectDesc.css("top", ( ($footer.position().top - 30) - ($projectDesc.outerHeight() + descOffset)) + "px");
      }
      else if ($projectDesc.is(".relative") && $(window).scrollTop() + descOffset < $projectDesc.offset().top) {
        $projectDesc.toggleClass("relative");
        $projectDesc.css("top", "");
      }
    });

    //modal view for images on mobile
    $(".project__images__item").click(function() {
      console.log("CLICKED");
      if ($(window).width() <= mobileWidth) { //only do this for mobile
        var $imgFull = $("<img>", {class: "modal-image", src: $(this).prop("src")});

        $("body").toggleClass("unscrollable"); //make the full screen non-scrollable
        $(".header").toggleClass("hidden");
        $(".content-overlay").toggleClass("active");
        $(".modal-image-container").prepend($imgFull);
      }
    });
  }

});
