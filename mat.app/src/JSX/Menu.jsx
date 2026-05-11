import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { menuSections } from "./menuData";

export default function Menu() {
  const navigate = useNavigate();

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
          <h2>Vår meny</h2>
          <p>Välj bland våra favoriträtter och se samma bilder som i galleriet.</p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-3">
            <div className="menu-filter-card">
              <h5>Filter</h5>
              <button className="menu-filter-button">Produkt typ ↓</button>
            </div>
          </div>

          <div className="col-12 col-md-9">
            {menuSections.map((section) => (
              <div className="menu-section mb-5" key={section.title}>
                <h3 className="menu-section-title">{section.title}</h3>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                  {section.items.map((item) => (
                    <div className="col" key={item.name}>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
