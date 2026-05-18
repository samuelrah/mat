import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* Cart-komponenten visar innehållet i kundvagnen och beräknar totalsumma. */
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  /* Hämtar sparade kundvagnsdata från localStorage när komponenten laddas. */
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  const getUnitPrice = (item) => {
    // Try several fields to find a numeric unit price
    const candidates = [item.price, item.unitPrice];
    for (const c of candidates) {
      const n = Number(c);
      if (!isNaN(n)) return n;
    }
    if (item.totalPrice && item.quantity) {
      const n = Number(item.totalPrice) / Number(item.quantity);
      if (!isNaN(n)) return n;
    }
    return 0;
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const unit = getUnitPrice(item);
    const qty = Number(item.quantity) || 1;
    return sum + unit * qty;
  }, 0);

  /* Rensar kundvagnen både i UI och i localStorage. */
  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  const persistCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const updateQuantity = (index, newQuantity) => {
    const qty = Math.max(1, Math.floor(newQuantity));
    const updated = cartItems.map((it, i) => {
      if (i !== index) return it;
      const unit = getUnitPrice(it);
      return {
        ...it,
        quantity: qty,
        totalPrice: Math.round(unit * qty),
      };
    });
    persistCart(updated);
  };

  const increaseQuantity = (index) => {
    const current = Number(cartItems[index].quantity) || 1;
    updateQuantity(index, current + 1);
  };

  const decreaseQuantity = (index) => {
    const current = Number(cartItems[index].quantity) || 1;
    // keep minimum 1
    if (current <= 1) return;
    updateQuantity(index, current - 1);
  };

  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    persistCart(updated);
  };

  return (
    <div className="container py-4" style={{ color: "white" }}>
      {cartItems.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <button type="button" className="btn btn-outline-light btn-sm me-2" onClick={clearCart}>
              Töm kundvagn
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/payment')}>
              Gå till betalning
            </button>
          </div>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: "100vh" }}>
          <h5>Kundvagn</h5>
          <p>Din kundvagn är tom.</p>
        </div>
      ) : (
        <>
          <div className="list-group mb-4">
            {cartItems.map((item, index) => {
              const unit = getUnitPrice(item);
              const qty = Number(item.quantity) || 1;
              const total = unit * qty;
              return (
                <div key={`${item.name}-${item.restaurantName}-${index}`} className="list-group-item list-group-item-dark mb-2 rounded">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-1">{item.name}</h5>
                      <p className="mb-1">{item.description}</p>
                      <small>{item.restaurantName}</small>
                    </div>
                    <div className="text-end">
                      <div className="d-flex align-items-center justify-content-end mb-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light me-2"
                          onClick={() => decreaseQuantity(index)}
                          aria-label={`Minska antal för ${item.name}`}
                        >
                          −
                        </button>

                        <span className="px-2" style={{ minWidth: 32, textAlign: "center", display: "inline-block" }}>
                          {qty}
                        </span>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light ms-2"
                          onClick={() => increaseQuantity(index)}
                          aria-label={`Öka antal för ${item.name}`}
                        >
                          +
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-3"
                          onClick={() => removeItem(index)}
                          aria-label={`Ta bort ${item.name}`}
                        >
                          🗑
                        </button>
                      </div>

                      <p className="mb-1">{unit.toFixed(0)} kr / st</p>
                      <strong>{Number(total).toFixed(0)} kr</strong>
                    </div>
                  </div>
                </div>
              );
            })}
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
