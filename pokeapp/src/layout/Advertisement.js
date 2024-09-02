import React, { useState, useEffect, useRef } from 'react';
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';

const Advertisement = () => {
  const [slides, setSlides] = useState([]);
  const [slideIndex, setSlideIndex] = useState(1);
  const slideRefs = useRef([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/advertisement/');
        const data = await response.json();
        if (data && data.length > 0) {
          const cloudinaryBaseURL = 'https://res.cloudinary.com/di0aqgf2u/';
          setSlides(data.map(slide => ({
            id: slide.id,
            image: cloudinaryBaseURL + slide.image,
          })));
        }
      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    };

    fetchSlides();
  }, []);

  const showSlides = (n) => {
    const dots = document.getElementsByClassName("dot");
    const slidesArray = slideRefs.current;

    if (n > slidesArray.length) setSlideIndex(1);
    if (n < 1) setSlideIndex(slidesArray.length);

    slidesArray.forEach((slide, index) => {
      if (slide) {
        slide.style.display = "none";
      }
    });

    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    if (slidesArray[slideIndex - 1]) {
      slidesArray[slideIndex - 1].style.display = "block";
    }
    if (dots[slideIndex - 1]) {
      dots[slideIndex - 1].className += " active";
    }
  };

  useEffect(() => {
    showSlides(slideIndex);

    const intervalId = setInterval(() => {
      setSlideIndex(prevIndex => {
        const newIndex = prevIndex + 1 > slides.length ? 1 : prevIndex + 1;
        showSlides(newIndex);
        return newIndex;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [slideIndex, slides]);

  const handlePrev = () => {
    setSlideIndex(prevIndex => {
      const newIndex = prevIndex - 1 < 1 ? slides.length : prevIndex - 1;
      showSlides(newIndex);
      return newIndex;
    });
  };

  const handleNext = () => {
    setSlideIndex(prevIndex => {
      const newIndex = prevIndex + 1 > slides.length ? 1 : prevIndex + 1;
      showSlides(newIndex);
      return newIndex;
    });
  };

  return (
    <div>
      <div className="advert-container">
        {slides.map((slide, index) => (
          <div
            className="advert fade"
            id={`slide-${index}`}
            key={slide.id}
            ref={el => slideRefs.current[index] = el}
          >
            <img src={slide.image} style={{ width: '100%' }} alt={`Slide ${index + 1}`} />
          </div>
        ))}
        <a className="prev" onClick={handlePrev}>&#10094;</a>
        <a className="next" onClick={handleNext}>&#10095;</a>
      </div>
      <div style={{ textAlign: 'center' }}>
        {slides.map((_, index) => (
          <span
            className="dot"
            key={index}
            onClick={() => setSlideIndex(index + 1)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Advertisement;
