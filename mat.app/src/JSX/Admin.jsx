import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
}
  useEffect(() => {
    // Check if user is authenticated and has admin permissions
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login'); 
      return;
    }
    
    const user = JSON.parse(userData);
    if (!user.isAdmin) {
      // Redirect non-admins back to home
      navigate('/');
      return;
    }
    
    setIsAdmin(true);
    setLoading(false);
  }, [navigate]);

  if (loading || !isAdmin) {
    return null; // Will redirect
  }


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function Admin() {
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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
    </div>
  );
}
