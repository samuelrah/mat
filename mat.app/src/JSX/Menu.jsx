import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { restaurants } from "./menuData";

// Den här komponenten visar en sektion av menyn som går att scrolla åt sidan.
// Den används för att bygga en del av menyn där det finns många produkter i en rad.
function ScrollableMenuSection({
  section,
  selectedRestaurant,
  quantities,
  handleQuantityChange,
  addToCart,
}) {
  // ref används för att komma åt själva DOM-elementet med scroll.
  const scrollRef = useRef(null);

  // State som berättar om vi kan scrolla åt vänster eller höger.
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Den här funktionen uppdaterar om pilarna för scrollning ska synas.
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // useEffect körs efter att komponenten har renderats.
  // Vi använder det här för att lyssna på scroll-händelser och uppdatera pilarna.
  useEffect(() => {
    updateScrollButtons();
    const handleScroll = () => updateScrollButtons();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Flytta scrollen åt vänster när man klickar på pilen.
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Flytta scrollen åt höger när man klickar på pilen.
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
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
          {section.items.map((item) => {
            // itemKey gör en unik nyckel för varje produkt och restaurang.
            const itemKey = `${selectedRestaurant.name}-${section.title}-${item.name}`;
            const itemQuantity = quantities[itemKey] === undefined ? 1 : quantities[itemKey];
            return (
              <div className="menu-scroll-item" key={itemKey}>
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
                  <div className="card-footer menu-card-footer d-flex justify-content-between align-items-center">
                    <div>
                      <span>{item.price}</span>
                      <input
                        type="number"
                        min="1"
                        value={itemQuantity}
                        onChange={(e) => handleQuantityChange(itemKey, e.target.value)}
                        onBlur={() => {
                          // Om fältet är tomt när användaren lämnar det, sätts det till 1.
                          if (quantities[itemKey] === "" || quantities[itemKey] === undefined) {
                            handleQuantityChange(itemKey, "1");
                          }
                        }}
                        className="form-control form-control-sm mt-2"
                        style={{ width: "70px" }}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={() => addToCart(item, selectedRestaurant.name, itemQuantity)}
                    >
                      Lägg till
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
  // useNavigate används för att byta sida, exempelvis till /login.
  const navigate = useNavigate();

  // useLocation används för att läsa URL:ens sökparametrar.
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryParam = params.get('q') || '';

  // Vald restaurang är den restaurang som visas i menyn.
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]);

  // quantities lagrar hur många av varje produkt användaren har skrivit.
  const [quantities, setQuantities] = useState({});

  // parsePrice gör om en pris-text (t.ex. "59 kr") till en siffra.
  const parsePrice = (price) => {
    const parsed = price.toString().replace(/[^0-9,.]/g, "").replace(",", ".");
    return Number(parsed) || 0;
  };

  // Uppdaterar antalet för en viss produkt i quantities state.
  const handleQuantityChange = (itemKey, value) => {
    const quantity = value === "" ? "" : Math.max(Number(value) || 1, 1);
    setQuantities((prev) => ({
      ...prev,
      [itemKey]: quantity,
    }));
  };

  // Lägger till en produkt i kundvagnen i localStorage.
  const addToCart = (item, restaurantName, quantity = 1) => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      // Om användaren inte är inloggad, skicka dem till login-sidan.
      navigate("/login");
      return;
    }

    const validQuantity = Math.max(Number(quantity) || 1, 1);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const unitPrice = parsePrice(item.price);
    const existingIndex = cart.findIndex(
      (cartItem) => cartItem.name === item.name && cartItem.restaurantName === restaurantName
    );

    if (existingIndex >= 0) {
      // Om varan redan finns i kundvagnen, lägg till antalet.
      cart[existingIndex].quantity += validQuantity;
      cart[existingIndex].totalPrice = cart[existingIndex].quantity * cart[existingIndex].unitPrice;
    } else {
      // Annars skapa en ny produkt-post i kundvagnen.
      cart.push({
        ...item,
        restaurantName,
        quantity: validQuantity,
        unitPrice,
        totalPrice: unitPrice * validQuantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} x${validQuantity} lades till i kundvagnen.`);
  };

  return (
    <div className="menu-page" style={{ minHeight: "100vh", paddingTop: "90px" }}>
      <div className="container-fluid py-4 px-5">
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
            {/* Om det finns ett sökord i URL:en visar vi sökresultaten istället för hela menyn. */}
            {queryParam ? (
              <div className="menu-section mb-4">
                <h3 className="menu-section-title">Sökresultat för "{queryParam}"</h3>
                <div className="menu-items-scroll">
                  {selectedRestaurant.sections.flatMap((section) =>
                    section.items
                      .filter((item) =>
                        (section.title + ' ' + item.name + ' ' + item.description)
                          .toLowerCase()
                          .includes(queryParam.toLowerCase())
                      )
                      .map((item) => (
                        <div className="menu-scroll-item" key={`${item.name}-${section.title}`}>
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
                            <div className="card-footer menu-card-footer d-flex justify-content-between align-items-center">
                              <span>{item.price}</span>
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={() => addToCart(item, selectedRestaurant.name)}
                              >
                                Lägg till
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="menu-section mb-4">
                  <h3 className="menu-section-title">{selectedRestaurant.name}</h3>
                  <p className="menu-card-text">Här är menyn för {selectedRestaurant.name}.</p>
                </div>

                {selectedRestaurant.sections.map((section) => (
                  <div className="menu-section mb-5" key={section.title}>
                    <h3 className="menu-section-title">{section.title}</h3>
                    <div className="menu-items-scroll">
                      {section.items.map((item) => (
                        <div className="menu-scroll-item" key={`${item.name}-${section.title}`}>
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
                            <div className="card-footer menu-card-footer d-flex justify-content-between align-items-center">
                              <span>{item.price}</span>
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={() => addToCart(item, selectedRestaurant.name)}
                              >
                                Lägg till
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
