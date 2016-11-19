/**
 *
 *
 * Created by J on 11/14/2015.
 */

$(document).ready(() => {
  var $contactForm = $(".footer__contact-form");

  if ($contactForm.is(":visible")) {
    $contactForm.find(".footer__contact-form__heading--send").click((e) => {
      var sendData = true,
          $email = $contactForm.find(".footer__contact-form__email"),
          $subject = $contactForm.find(".footer__contact-form__subject"),
          $message = $contactForm.find(".footer__contact-form__message"),
          $footerConfirm = $(".footer__confirm");
      e.preventDefault();

      //basic validation
      if ($subject.val().length === 0) {
        $subject.prop("placeholder", "PLEASE ENTER A SUBJECT");
        $subject.toggleClass("input-error", true);
        sendData = false;
      }
      if ($message.val().length === 0) {
        $message.prop("placeholder", "PLEASE ENTER A MESSAGE");
        $message.toggleClass("input-error", true);
        sendData = false;
      }
      if ($email.val().length === 0 || $email.val().indexOf("@") < 0) {
        $email.prop("placeholder", "ENTER AN E-MAIL");
        $email.toggleClass("input-error", true);
        sendData = false;
      }

      if (sendData) {
        $.post("api/send", $contactForm.serialize(), (data) => {
          if (parseInt(data["status"]) === 0) { //error
            $footerConfirm.text("There was an error with your message: " + data["error"]);
            $footerConfirm.toggleClass("footer__confirm--error");
          }
          else if (parseInt(data["status"]) === 1) {
            $footerConfirm.text("Thank you for your message! I will get back to you as soon as I can.");
            $footerConfirm.toggleClass("footer__confirm--success");
          }
          $contactForm.toggle();
          $footerConfirm.toggleClass("footer__confirm--active");
        });
      }
    });
  }
});
