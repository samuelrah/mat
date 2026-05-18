import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { restaurants } from "./menuData";

function ScrollableMenuSection({
  section,
  selectedRestaurant,
  quantities,
  handleQuantityChange,
  addToCart,
}) {
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
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

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
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryParam = params.get('q') || '';
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]);
  const [quantities, setQuantities] = useState({});

  /* Omvandlar prissträng till ett numeriskt värde för beräkningar. */
  const parsePrice = (price) => {
    const parsed = price.toString().replace(/[^0-9,.]/g, "").replace(",", ".");
    return Number(parsed) || 0;
  };

  /* Sparar vald kvantitet för en produkt.
     Om användaren tar bort allt i inputfältet sparas tom sträng först,
     sedan blir det 1 igen när fältet tappar fokus eller när produkten läggs till. */
  const handleQuantityChange = (itemKey, value) => {
    const quantity = value === "" ? "" : Math.max(Number(value) || 1, 1);
    setQuantities((prev) => ({
      ...prev,
      [itemKey]: quantity,
    }));
  };

  /* Lägger till en vald produkt i kundvagnen i localStorage. */
  const addToCart = (item, restaurantName, quantity = 1) => {
    const userData = localStorage.getItem("user");
    if (!userData) {
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
      cart[existingIndex].quantity += validQuantity;
      cart[existingIndex].totalPrice = cart[existingIndex].quantity * cart[existingIndex].unitPrice;
    } else {
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
    <div className="menu-page" style={{ minHeight: "100vh", paddingTop: "80px" }}>
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
            {/* If a search query exists, show filtered results across sections */}
            {queryParam ? (
              <div className="menu-section mb-4">
                <h3 className="menu-section-title">Sökresultat för "{queryParam}"</h3>
                <div className="menu-items-scroll">
                  {selectedRestaurant.sections.flatMap((section) =>
                    section.items
                      .filter((item) =>
                        (item.name + ' ' + item.description)
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
