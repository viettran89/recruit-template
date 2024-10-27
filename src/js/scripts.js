'use strict';

(function app() {
  const spBreak = 767.98;

  function isMobile() {
    return window.matchMedia('(max-width: ' + spBreak + 'px)').matches;
  }

  function NavigationMenuModule() {
    $(window).on('load scroll', () => {
      $(".header").toggleClass('is-sticky', $(window).scrollTop() > 0 )
    })


    const navigation = $('.js-navigation');
    $('.js-button-menu').click(function () {
      $('.header').toggleClass('is-active');
      navigation.addClass('is-show');

      $(this).toggleClass('is-active');
      if ($(this).hasClass('is-active')) {
        $('body').css({ overflow: 'hidden' });
        navigation.stop().fadeIn();
      } else {
        navigation.removeClass('is-show');
        $('body').css({ overflow: 'unset' });
        navigation.stop().fadeOut();
      }
      return false;
    });

    $('.js-btn-close').click(function (e) {
      e.preventDefault();
      $('body').css({ overflow: 'unset' });
      navigation.stop().fadeOut();
      navigation.removeClass('is-show');
      $('.js-button-menu').removeClass('is-active');
    });
  }

  function SwiperModule() {
    if ($('.js-keyvisual-swiper').length) {
      new Swiper('.js-keyvisual-swiper', {
        loop: true,
        slidesPerView: 1,
        parallax: true,
        pagination: {
          el: '.js-keyvisual-swiper .swiper-pagination',
          type: 'bullets',
          clickable: true
        },
      });
    }
  }

  $(function init() {
    NavigationMenuModule();
    SwiperModule();
  });
}());