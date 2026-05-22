import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/* Menu-komponenten visar restaurangmenyer och lägger till artiklar i kundvagnen. */
export default function Menu() {
  // useNavigate används för att byta sida, exempelvis till /login.
  const navigate = useNavigate();

  // useLocation används för att läsa URL:ens sökparametrar.
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryParam = params.get('q') || '';
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({});

  /* Grupperar maträtter efter restaurang */
  const groupDishesByRestaurant = (allDishes) => {
    const grouped = {};
    allDishes.forEach(dish => {
      const restaurantName = dish.restaurant || "Övrigt";
      if (!grouped[restaurantName]) {
        grouped[restaurantName] = [];
      }
      grouped[restaurantName].push(dish);
    });
    return grouped;
  };

  /* Hämtar alla maträtter från databasen */
  const fetchDishes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/api/dishes`);
      if (!response.ok) {
        throw new Error("Failed to fetch dishes");
      }
      const data = await response.json();
      setDishes(data);
      
      // Extrahera unika restauranger och sortera
      const restaurantNames = [...new Set(data.map(d => d.resturant || "Övrigt"))].sort();
      const restaurantList = restaurantNames.map(name => ({ name }));
      setRestaurants(restaurantList);
      
      // Sätt första restaurangen som vald
      if (restaurantList.length > 0) {
        setSelectedRestaurant(restaurantList[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching dishes:", err);
    } finally {
      setLoading(false);
    }
  };

  /* Hämtar maträtter när komponenten monteras */
  useEffect(() => {
    fetchDishes();

    /* Lyssnar efter när nya rätter läggs till från admin-panelen */
    const handleDishAdded = () => {
      fetchDishes();
    };

    window.addEventListener('dishAdded', handleDishAdded);
    return () => window.removeEventListener('dishAdded', handleDishAdded);
  }, []);

  /* Omvandlar prissträng till ett numeriskt värde för beräkningar. */
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
  const addToCart = (dish) => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      // Om användaren inte är inloggad, skicka dem till login-sidan.
      navigate("/login");
      return;
    }

    const itemKey = dish.matnamn;
    const quantity = quantities[itemKey] || 1;
    const validQuantity = Math.max(Number(quantity) || 1, 1);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const unitPrice = parsePrice(dish.matprice);
    const existingIndex = cart.findIndex(
      (cartItem) => cartItem.matNamn === dish.matnamn
    );

    if (existingIndex >= 0) {
      // Om varan redan finns i kundvagnen, lägg till antalet.
      cart[existingIndex].quantity += validQuantity;
      cart[existingIndex].totalPrice = cart[existingIndex].quantity * cart[existingIndex].unitPrice;
    } else {
      // Annars skapa en ny produkt-post i kundvagnen.
      cart.push({
        matNamn: dish.matnamn,
        matPrice: dish.matprice,
        matRating: dish.matrating || 0,
        matDesc: dish.matdesc,
        quantity: validQuantity,
        unitPrice,
        totalPrice: unitPrice * validQuantity,
        restaurant: dish.resturant || selectedRestaurant.name,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${dish.matnamn} lades till i kundvagnen.`);
  };

  return (
    <div className="menu-page" style={{ minHeight: "100vh", paddingTop: "90px" }}>
      {loading && (
        <div className="container-fluid py-4 px-5">
          <div className="alert alert-info">Laddar meny...</div>
        </div>
      )}
      {error && (
        <div className="container-fluid py-4 px-5">
          <div className="alert alert-danger">Fel: {error}</div>
        </div>
      )}
      {!loading && (
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
                        restaurant.name === selectedRestaurant?.name ? "active" : ""
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
              {selectedRestaurant && (
                <>
                  {/* Search results view */}
                  {queryParam ? (
                    <div className="menu-section mb-4">
                      <h3 className="menu-section-title">Sökresultat för "{queryParam}"</h3>
                      <div className="menu-items-scroll">
                        {dishes
                          .filter((dish) =>
                            (dish.resturant || "Övrigt") === selectedRestaurant.name &&
                            (dish.matnamn + ' ' + (dish.matdesc || ''))
                              .toLowerCase()
                              .includes(queryParam.toLowerCase())
                          )
                          .map((dish) => (
                            <div className="menu-scroll-item" key={dish.matnamn}>
                              <div className="menu-card card h-100 shadow-sm overflow-hidden">
                                {dish.matimage ? (
                                  <img
                                    src={process.env.PUBLIC_URL + "../public/MAT-IMAGES/" + dish.matimage}
                                    alt={dish.matnamn}
                                    className="menu-card-img-top"
                                  />
                                ) : (
                                  <div className="menu-card-img-top" style={{
                                    backgroundColor: '#e9ecef',
                                    height: '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    color: '#6c757d'
                                  }}>
                                    [Ingen bild]
                                  </div>
                                )}
                                <div className="card-body">
                                  <h5>{dish.matnamn}</h5>
                                  <p className="menu-card-text">{dish.matdesc || 'Ingen beskrivning'}</p>
                                </div>
                                <div className="card-footer menu-card-footer d-flex justify-content-between align-items-center">
                                  <span>{dish.matprice} kr</span>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    onClick={() => addToCart(dish)}
                                  >
                                    Lägg till
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Restaurant view */}
                      <div className="menu-section mb-4">
                        <h3 className="menu-section-title">{selectedRestaurant.name}</h3>
                        <p className="menu-card-text">Här är menyn för {selectedRestaurant.name}.</p>
                      </div>

                      <div className="menu-section mb-5">
                        <div className="menu-items-scroll">
                          {dishes
                            .filter((dish) => (dish.resturant || "Övrigt") === selectedRestaurant.name)
                            .map((dish) => (
                              <div className="menu-scroll-item" key={dish.matnamn}>
                                <div className="menu-card card h-100 shadow-sm overflow-hidden">
                                  {dish.matimage ? (
                                    <img
                                      src={process.env.PUBLIC_URL + "/MAT-IMAGES/" + dish.matimage}
                                      alt={dish.matnamn}
                                      className="menu-card-img-top"
                                    />
                                  ) : (
                                    <div className="menu-card-img-top" style={{
                                      backgroundColor: '#e9ecef',
                                      height: '200px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '12px',
                                      color: '#6c757d'
                                    }}>
                                      [Ingen bild]
                                    </div>
                                  )}
                                  <div className="card-body">
                                    <h5>{dish.matnamn}</h5>
                                    <p className="menu-card-text">{dish.matdesc || 'Ingen beskrivning'}</p>
                                  </div>
                                  <div className="card-footer menu-card-footer d-flex justify-content-between align-items-center">
                                    <span>{dish.matprice} kr</span>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-success"
                                      onClick={() => addToCart(dish)}
                                    >
                                      Lägg till
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
