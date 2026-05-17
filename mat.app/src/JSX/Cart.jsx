import React, { useEffect, useState } from "react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
    0
  );

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  return (
    <div className="container py-4" style={{ color: "white" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button type="button" className="btn btn-outline-light btn-sm" onClick={clearCart}>
          Töm kundvagn
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "60vh" }}>
          <h5>Kundvagn</h5>
          <p>Din kundvagn är tom.</p>
        </div>
      ) : (
        <>
          <div className="list-group mb-4">
            {cartItems.map((item, index) => (
              <div key={`${item.name}-${item.restaurantName}-${index}`} className="list-group-item list-group-item-dark mb-2 rounded">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="mb-1">{item.description}</p>
                    <small>{item.restaurantName}</small>
                  </div>
                  <div className="text-end">
                    <p className="mb-1">{item.quantity} x {item.price}</p>
                    <strong>{item.totalPrice.toFixed(0)} kr</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-dark text-white p-4 rounded">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Total</h5>
              <strong>{totalAmount.toFixed(0)} kr</strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
