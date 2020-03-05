"use strict";

(function() {
  const burgerButton = document.querySelector(".js-burger");
  const menu = document.querySelector(".js-menu");
  const elWithSubmenu = document.querySelector(".js-open-submenu");
  const submenu = document.querySelector(".js-submenu");

  elWithSubmenu.addEventListener("click", () => {
    elWithSubmenu.classList.toggle("open");
    submenu.classList.toggle("open");
  });

  window.addEventListener("click", evt => {
    if (!(submenu.contains(evt.target) || elWithSubmenu.contains(evt.target))) {
      elWithSubmenu.classList.remove("open");
      submenu.classList.remove("open");
    }
  });

  burgerButton.addEventListener("click", () => {
    burgerButton.classList.toggle("open");
    menu.classList.toggle("open");
  });

  new Swiper(".swiper-container", {
    //loop: true,
    pagination: {
      el: ".slider__pagination"
    },
    slidesPerView: 1,
    breakpoints: {
      1160: {
        slidesPerView: 2,
        slidesPerGroup: 2
      }
    }
  });
})();
