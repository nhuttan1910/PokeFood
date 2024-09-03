// window.addEventListener('load', function() {
//   let slide = document.querySelector(".advert-container")
//   let dots = document.getElementsByClassName("dot");
//   let slideWidth = document.querySelector('.advert').offsetWidth
//   let i = 1;
//   this.setInterval(function() {
//     slide.style.transform = `translateX(-${slideWidth * i}px)`
//     i++
//     if (i == 3) {
//       i = 0
//     }
//   }, 3000)
// })

//document.addEventListener("DOMContentLoaded", function () {
//  let slideIndex = 1;
//  showSlides(slideIndex);
//
//  let slideInterval = setInterval(function () {
//    plusSlides(1);
//  }, 5000); // 2000 ms = 2 giây
//
//  function plusSlides(n) {
//    showSlides((slideIndex += n));
//  }
//
//  function currentSlide(n) {
//    showSlides((slideIndex = n));
//  }
//
//  function showSlides(n) {
//    let i;
//    let slides = document.getElementsByClassName("advert");
//    let dots = document.getElementsByClassName("dot");
//
//    if (n > slides.length) {
//      slideIndex = 1;
//    }
//    if (n < 1) {
//      slideIndex = slides.length;
//    }
//
//    for (i = 0; i < slides.length; i++) {
//      slides[i].style.display = "none";
//    }
//    for (i = 0; i < dots.length; i++) {
//      dots[i].className = dots[i].className.replace(" active", "");
//    }
//
//    slides[slideIndex - 1].style.display = "block";
//    dots[slideIndex - 1].className += " active";
//  }
//
//  // Gán sự kiện cho các nút điều hướng
//  document.querySelector(".prev").addEventListener("click", function () {
//    plusSlides(-1);
//  });
//
//  document.querySelector(".next").addEventListener("click", function () {
//    plusSlides(1);
//  });
//
//  // Gán sự kiện cho các chấm tròn (dots)
//  document.querySelectorAll(".dot").forEach((dot, index) => {
//    dot.addEventListener("click", function () {
//      currentSlide(index + 1);
//    });
//  });
//
//  function resetInterval() {
//    clearInterval(slideInterval); // Dừng interval hiện tại
//    slideInterval = setInterval(function () {
//      plusSlides(1);
//    }, 5000);
//  }
//});
//
//window.initializeSlider = initializeSlider;


export function autoSlider(slideInterval, setSlideInterval, slideIndex, setSlideIndex, totalSlides) {
  clearInterval(slideInterval);
  setSlideInterval(setInterval(() => {
    setSlideIndex((prevIndex) => (prevIndex + 1) > totalSlides ? 1 : prevIndex + 1);
  }, 5000));
}

export function showSlides(slideIndex, slides, dots) {
  slides.forEach((slide, index) => {
    slide.style.display = index + 1 === slideIndex ? 'block' : 'none';
  });

  dots.forEach((dot, index) => {
    dot.className = dot.className.replace(' active', '');
    if (index + 1 === slideIndex) {
      dot.className += ' active';
    }
  });
}









