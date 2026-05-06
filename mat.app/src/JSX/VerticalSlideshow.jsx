import React, { useEffect, useRef } from 'react';
import '../CSS/App.css';

const slides = [
  {
    image: '../Images/bg.png',
    text: 'Welcome to our restaurant. Enjoy delicious food and great ambiance.',
    alt: 'Restaurant interior'
  },
  {
    image: '../Images/bg.png',
    text: 'Our chefs prepare fresh meals daily with the finest ingredients.',
    alt: 'Chef cooking'
  },
  {
    image: '../Images/bg.png',
    text: 'Experience a variety of cuisines from around the world.',
    alt: 'Food variety'
  }
];

export default function VerticalSlideshow() {
  const slideRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.5 }
    );

    slideRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="slideshow-container">
      {slides.map((slide, index) => (
        <section
          key={index}
          ref={(el) => (slideRefs.current[index] = el)}
          className={slide }
        >
          <div className="slide-image">
            <img src={slide.image} alt={slide.alt} />
          </div>
          <div className="slide-text">
            <p>{slide.text}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
