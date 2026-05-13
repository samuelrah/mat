import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { restaurants } from "./menuData";

function ScrollableMenuSection({ section }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const handleScroll = () => updateScrollButtons();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="menu-section mb-5" key={section.title}>
      <h3 className="menu-section-title">{section.title}</h3>
      <div className="menu-scroll-container">
        {canScrollLeft && (
          <button className="scroll-arrow scroll-arrow-left" onClick={scrollLeft}>
            ‹
          </button>
        )}
        <div className="menu-items-scroll" ref={scrollRef}>
          {section.items.map((item) => (
            <div className="menu-scroll-item" key={item.name}>
              <div className="menu-card card h-100 shadow-sm overflow-hidden">
                <img
                  src={process.env.PUBLIC_URL + "/MAT-IMAGES/" + item.image}
                  alt={item.name}
                  className="menu-card-img-top"
                />
                <div className="card-body">
                  <h5>{item.name}</h5>
                  <p className="menu-card-text">{item.description}</p>
                </div>
                <div className="card-footer menu-card-footer">
                  <span>{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button className="scroll-arrow scroll-arrow-right" onClick={scrollRight}>
            ›
          </button>
        )}
      </div>
    </div>
  );
}

export default function Menu() {
  const navigate = useNavigate();
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="menu-page" style={{ minHeight: "100vh", paddingTop: "80px" }}>
      <div className="container-fluid py-4 px-5">
        <div className="menu-header mb-4">
          <h2>Välj restaurang</h2>
          <p>Klicka på en restaurang i menyn till vänster för att se dess meny.</p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-3">
            <div className="menu-filter-card restaurant-card">
              <h5>Restauranger</h5>
              <div className="restaurant-list">
                {restaurants.map((restaurant) => (
                  <button
                    key={restaurant.name}
                    type="button"
                    className={`restaurant-button ${
                      restaurant.name === selectedRestaurant.name ? "active" : ""
                    }`}
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    {restaurant.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-9">
            <div className="menu-section mb-4">
              <h3 className="menu-section-title">{selectedRestaurant.name}</h3>
              <p className="menu-card-text">Här är menyn för {selectedRestaurant.name}.</p>
            </div>

            {selectedRestaurant.sections.map((section) => (
              <ScrollableMenuSection key={section.title} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
