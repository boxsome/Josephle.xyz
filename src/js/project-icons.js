$(document).ready(function() {

  $(".project-icon").hover(function() {
    $(this).children(".project-icon-tooltip").toggleClass("project-icon-tooltip--active");
  }, function() {
    $(this).children(".project-icon-tooltip").toggleClass("project-icon-tooltip--active");
  });
})