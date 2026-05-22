import React, { useState } from "react";
import { restaurants } from "./menuData";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/* Admin-komponenten visar adminstatistik och användarhanteringsverktyg. */
export default function Admin() {
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showCreateDishForm, setShowCreateDishForm] = useState(false);
  const [showRemoveDishForm, setShowRemoveDishForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    phoneNum: "",
    userMail: "",
    userAdress: "",
    password: "",
    confirmPassword: "",
    user_is_premium: false,
    user_is_admin: false,
  });
  const [dishData, setDishData] = useState({
    matNamn: "",
    matPrice: "",
    matRating: "",
    matDesc: "",
    restaurant: "",
  });
  const [dishToRemove, setDishToRemove] = useState("");

  /* Uppdaterar formulärvärden för att skapa en ny användare. */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* Uppdaterar formulärvärden för att skapa en ny maträtt. */
  const handleDishInputChange = (e) => {
    const { name, value } = e.target;
    setDishData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* Skapar en ny användare via API och visar statusmeddelanden. */
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.password || formData.password.length < 8) {
      setMessage("✗ Error: Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("✗ Error: Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setMessage(`✓ User "${data.userName}" created successfully!`);
      setFormData({
        userName: "",
        firstName: "",
        lastName: "",
        phoneNum: "",
        userMail: "",
        userAdress: "",
        password: "",
        confirmPassword: "",
        user_is_premium: false,
        user_is_admin: false,
      });
      setTimeout(() => setShowCreateUserForm(false), 2000);
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* Skapar en ny maträtt via API och visar statusmeddelanden. */
  const handleCreateDish = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!dishData.matNamn || !dishData.matPrice) {
      setMessage("✗ Error: Dish name and price are required.");
      setLoading(false);
      return;
    }

    if (dishData.matRating && (isNaN(dishData.matRating) || dishData.matRating < 1 || dishData.matRating > 5)) {
      setMessage("✗ Error: Rating must be between 1 and 5.");
      setLoading(false);
      return;
    }

    try {
      const dishPayload = {
        matNamn: dishData.matNamn,
        matPrice: parseFloat(dishData.matPrice),
        matRating: dishData.matRating ? parseInt(dishData.matRating) : null,
        matDesc: dishData.matDesc || null,
        restaurant: dishData.restaurant || null,
      };

      const response = await fetch(`${API_URL}/api/dishes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dishPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create dish");
      }

      setMessage(`✓ Dish "${data.matNamn}" created successfully!`);
      setDishData({
        matNamn: "",
        matPrice: "",
        matRating: "",
        matDesc: "",
        restaurant: "",
      });
      window.dispatchEvent(new Event('dishAdded'));
      setTimeout(() => setShowCreateDishForm(false), 2000);
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* Tar bort en maträtt från servern via API och visar statusmeddelanden. */
  const handleRemoveDish = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!dishToRemove) {
      setMessage("✗ Error: Dish name is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/dishes/${dishToRemove}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove dish");
      }

      setMessage(`✓ Dish "${dishToRemove}" removed successfully!`);
      setDishToRemove("");
      window.dispatchEvent(new Event('dishAdded'));
      setTimeout(() => setShowRemoveDishForm(false), 2000);
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Adminpanel</h2>
        <p>Översikt av webbplatsstatistik och användarhantering.</p>
      </div>

      <div className="admin-grid">
        <section className="admin-card">
          <h3>Webbplatsstatistik</h3>
          <div className="stat-row">
            <div>
              <strong>Besökare idag</strong>
              <p>1 248</p>
            </div>
            <div>
              <strong>Sidvisningar</strong>
              <p>4 562</p>
            </div>
          </div>
          <div className="stat-row">
            <div>
              <strong>Aktiva användare</strong>
              <p>67</p>
            </div>
            <div>
              <strong>Nya konton</strong>
              <p>12</p>
            </div>
          </div>
        </section>

        <section className="admin-card admin-users">
          <h3>Användarhantering</h3>
          <p>Hantera konton, roller och åtkomst.</p>
          <ul>
            <li>Benjamin Nethanyahu — Aktiv</li>
            <li>Ben the dog — Inaktiv</li>
            <li>Dedu — Admin</li>
            <li>jadu — Aktiv</li>
          </ul>
          <button
            className="admin-action"
            onClick={() => setShowCreateUserForm(!showCreateUserForm)}
          >
            {showCreateUserForm ? "Stäng formulär" : "Skapa ny användare"}
          </button>
        </section>

        <section className="admin-card admin-dishes">
          <h3>Menyhantering</h3>
          <p>Lägg till, redigera och ta bort maträtter.</p>
          <button
            className="admin-action"
            onClick={() => setShowCreateDishForm(!showCreateDishForm)}
          >
            {showCreateDishForm ? "Stäng formulär" : "Lägg till ny maträtt"}
          </button>
          <button
            className="admin-action"
            onClick={() => setShowRemoveDishForm(!showRemoveDishForm)}
          >
            {showRemoveDishForm ? "Stäng formulär" : "Ta bort maträtt"}
          </button>
        </section>
      </div>

      {showCreateUserForm && (
        <section className="admin-card create-user-form">
          <h3>Skapa ny användare</h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label htmlFor="userName">Användarnamn *</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Förnamn *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Efternamn *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="userMail">E-post *</label>
              <input
                type="email"
                id="userMail"
                name="userMail"
                value={formData.userMail}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Lösenord *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Bekräfta lösenord *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNum">Telefon</label>
              <input
                type="tel"
                id="phoneNum"
                name="phoneNum"
                value={formData.phoneNum}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="userAdress">Adress *</label>
              <input
                type="text"
                id="userAdress"
                name="userAdress"
                value={formData.userAdress}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group checkbox">
                <label htmlFor="user_is_premium">
                  <input
                    type="checkbox"
                    id="user_is_premium"
                    name="user_is_premium"
                    checked={formData.user_is_premium}
                    onChange={handleInputChange}
                  />
                  Premium användare
                </label>
              </div>
              <div className="form-group checkbox">
                <label htmlFor="user_is_admin">
                  <input
                    type="checkbox"
                    id="user_is_admin"
                    name="user_is_admin"
                    checked={formData.user_is_admin}
                    onChange={handleInputChange}
                  />
                  Admin
                </label>
              </div>
            </div>

            {message && (
              <div
                className={`message ${
                  message.includes("✓") ? "success" : "error"
                }`}
              >
                {message}
              </div>
            )}

            <button type="submit" className="admin-action" disabled={loading}>
              {loading ? "Skapar..." : "Skapa användare"}
            </button>
          </form>
        </section>
      )}

      {showCreateDishForm && (
        <section className="admin-card create-dish-form">
          <h3>Lägg till ny maträtt</h3>
          <form onSubmit={handleCreateDish}>
            <div className="form-group">
              <label htmlFor="matNamn">Maträtt namn *</label>
              <input
                type="text"
                id="matNamn"
                name="matNamn"
                value={dishData.matNamn}
                onChange={handleDishInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="restaurant">Restaurang</label>
              <select
                id="restaurant"
                name="restaurant"
                value={dishData.restaurant}
                onChange={handleDishInputChange}
              >
                <option value="">Välj restaurang...</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.name} value={restaurant.name}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="matPrice">Pris *</label>
                <input
                  type="number"
                  id="matPrice"
                  name="matPrice"
                  step="0.01"
                  value={dishData.matPrice}
                  onChange={handleDishInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="matRating">Betyg (1-5)</label>
                <input
                  type="number"
                  id="matRating"
                  name="matRating"
                  min="1"
                  max="5"
                  value={dishData.matRating}
                  onChange={handleDishInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="matDesc">Beskrivning</label>
              <textarea
                id="matDesc"
                name="matDesc"
                value={dishData.matDesc}
                onChange={handleDishInputChange}
                rows="4"
              />
            </div>

            {message && (
              <div
                className={`message ${
                  message.includes("✓") ? "success" : "error"
                }`}
              >
                {message}
              </div>
            )}

            <button type="submit" className="admin-action" disabled={loading}>
              {loading ? "Lägger till..." : "Lägg till maträtt"}
            </button>
          </form>
        </section>
      )}

      {showRemoveDishForm && (
        <section className="admin-card remove-dish-form">
          <h3>Ta bort maträtt</h3>
          <form onSubmit={handleRemoveDish}>
            <div className="form-group">
              <label htmlFor="dishToRemove">Maträtt namn *</label>
              <input
                type="text"
                id="dishToRemove"
                value={dishToRemove}
                onChange={(e) => setDishToRemove(e.target.value)}
                placeholder="Ange namn på maträtten att ta bort"
                required
              />
            </div>

            {message && (
              <div
                className={`message ${
                  message.includes("✓") ? "success" : "error"
                }`}
              >
                {message}
              </div>
            )}

            <button type="submit" className="admin-action" disabled={loading}>
              {loading ? "Tar bort..." : "Ta bort maträtt"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
