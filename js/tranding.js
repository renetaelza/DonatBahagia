var TrandingSlider = new Swiper('#tranding .tranding-slider', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2.5,
  },
  pagination: {
    el: '#tranding .swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '#tranding .swiper-button-next',
    prevEl: '#tranding .swiper-button-prev',
  }
});
