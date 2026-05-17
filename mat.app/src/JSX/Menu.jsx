import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { restaurants } from "./menuData";

/* Menu-komponenten visar restaurangmenyer och lägger till artiklar i kundvagnen. */
export default function Menu() {
  const navigate = useNavigate();
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]);

  /* Omvandlar prissträng till ett numeriskt värde för beräkningar. */
  const parsePrice = (price) => {
    const parsed = price.toString().replace(/[^0-9,.]/g, "").replace(",", ".");
    return Number(parsed) || 0;
  };

  /* Lägger till en vald produkt i kundvagnen i localStorage. */
  const addToCart = (item, restaurantName) => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const unitPrice = parsePrice(item.price);
    const existingIndex = cart.findIndex(
      (cartItem) => cartItem.name === item.name && cartItem.restaurantName === restaurantName
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
      cart[existingIndex].totalPrice = cart[existingIndex].quantity * cart[existingIndex].unitPrice;
    } else {
      cart.push({
        ...item,
        restaurantName,
        quantity: 1,
        unitPrice,
        totalPrice: unitPrice,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} lades till i kundvagnen.`);
  };

<<<<<<< HEAD
=======
  /* Redirectar till inloggning om användaren inte är inloggad. */
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    }
  }, [navigate]);

>>>>>>> 707a93243d14cef0ee772867e0bcb6c7c2fb3471
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
          </div>
        </div>
      </div>
    </div>
  );
}
