import React, { useState, useEffect } from 'react';
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';

const Advertisement = () => {
  const [slideIndex, setSlideIndex] = useState(1);

  const showSlides = (n) => {
    const slides = document.getElementsByClassName('advert');
    const dots = document.getElementsByClassName('dot');

    if (n > slides.length) {
      setSlideIndex(1);
    } else if (n < 1) {
      setSlideIndex(slides.length);
    } else {
      setSlideIndex(n);
    }

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' active', '');
    }

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += ' active';
  };

  useEffect(() => {
    showSlides(slideIndex);
    const interval = setInterval(() => {
      setSlideIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        return newIndex > 3 ? 1 : newIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [slideIndex]);

  const plusSlides = (n) => {
    setSlideIndex(prevIndex => {
      const newIndex = prevIndex + n;
      return newIndex > 3 ? 1 : newIndex < 1 ? 3 : newIndex;
    });
  };

  const currentSlide = (n) => {
    setSlideIndex(n);
  };

  return (
    <div className="advert-container">
      <div className={`advert fade ${slideIndex === 1 ? 'show' : ''}`}>
        <img src="https://res.cloudinary.com/di0aqgf2u/image/upload/v1725297197/ywbhzhvx31xa1jse4rmj.jpg" style={{ width: '100%' }} alt="Slide 1" />
      </div>
      <div className={`advert fade ${slideIndex === 2 ? 'show' : ''}`}>
        <img src="https://res.cloudinary.com/di0aqgf2u/image/upload/v1725297654/tm42je6d4g3kgtmk1ybf.jpg" style={{ width: '100%' }} alt="Slide 2" />
      </div>
      <div className={`advert fade ${slideIndex === 3 ? 'show' : ''}`}>
        <img src="https://res.cloudinary.com/di0aqgf2u/image/upload/v1725297668/wljkfvdyn53o6s3sysai.jpg" style={{ width: '100%' }} alt="Slide 3" />
      </div>

      <a className="prev" onClick={() => plusSlides(-1)}>❮</a>
      <a className="next" onClick={() => plusSlides(1)}>❯</a>

      <div style={{ textAlign: 'center' }}>
        <span className={`dot ${slideIndex === 1 ? 'active' : ''}`} onClick={() => currentSlide(1)}></span>
        <span className={`dot ${slideIndex === 2 ? 'active' : ''}`} onClick={() => currentSlide(2)}></span>
        <span className={`dot ${slideIndex === 3 ? 'active' : ''}`} onClick={() => currentSlide(3)}></span>
      </div>
    </div>
  );
};

export default Advertisement;
