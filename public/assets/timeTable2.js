var nextSlide;
var prevSlide;
var count = 0;
var keepCount;
var validate;
var loginSubmit;
$(document).ready(function() {
  $('.wrapper > div:gt(0)').hide();
  nextSlide = function() {
    var activeSlide = $('.wrapper').find('.active');
    activeSlide.next().addClass('active').show();
    activeSlide.removeClass('active').hide();
    count++;
    keepCount();

  }
  prevSlide = function() {
    var activeSlide = $('.wrapper').find('.active');
    activeSlide.prev().addClass('active').show();
    activeSlide.removeClass('active').hide();
    count--;
    keepCount();

  }
  keepCount = function() {
    if (count == 4) {
      $('.icons').find('.nextBt').prop('disabled', true);
    } else if (count == 0) {
      $('.icons').find('.preBt').prop('disabled', true);
    } else {
      $('.icons').find('.nextBt').prop('disabled', false);
      $('.icons').find('.preBt').prop('disabled', false);
    }
  }

});
$(function() {
  console.log('hello in next function');
  var pass = document.getElementById('Userpass');
  var passConf = document.getElementById('passwordConf');
  var form = document.getElementById('login');
  var form1 = document.getElementById('lgForm');
  validate = function() {
    if (pass.value !== passConf.value) {
      alert("passwords do not match");

    } else {
      form.submit();
    }
  }
  loginSubmit = function() {
    form1.submit();
  }
});