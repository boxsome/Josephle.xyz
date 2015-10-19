$(document).ready(function() {

  $(".project__meta__heading__icons__item").hover(function() {
    $(this).children(".project-icon-tooltip").toggleClass("project-icon-tooltip--active");
  }, function() {
    $(this).children(".project-icon-tooltip").toggleClass("project-icon-tooltip--active");
  });
})