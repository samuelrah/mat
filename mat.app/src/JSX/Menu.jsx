import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { menuSections } from "./menuData";

export default function Menu({ searchQuery = "" }) {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    }
  }, [navigate]);

  const query = searchQuery?.trim().toLowerCase();
  const allItems = menuSections.flatMap((section) =>
    section.items.map((item) => ({ ...item, sectionTitle: section.title }))
  );

  const filteredItems = query
    ? allItems.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.sectionTitle.toLowerCase().includes(query)
      )
    : [];

  const recommendedItems = query && filteredItems.length > 0
    ? allItems
        .filter((item) =>
          filteredItems.some(
            (matched) =>
              matched.sectionTitle === item.sectionTitle && matched.name !== item.name
          )
        )
        .filter(
          (item, index, list) =>
            list.findIndex((other) => other.name === item.name) === index
        )
    : [];

  const hasQuery = Boolean(query);

  return (
    <div className="menu-page" style={{ minHeight: "100vh", paddingTop: "80px" }}>
      <div className="container-fluid py-4 px-5">
        <div className="menu-header mb-4">
          <h2>Vår meny</h2>
          <p>Välj bland våra favoriträtter och se samma bilder som i galleriet.</p>
          {hasQuery && (
            <div className="search-summary mt-3">
              <p>
                Resultat för <strong>"{searchQuery}"</strong>.
                {filteredItems.length === 0 && " Inga matchande produkter hittades."}
              </p>
            </div>
          )}
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-3">
            <div className="menu-filter-card">
              <h5>Filter</h5>
              <button className="menu-filter-button">Produkt typ ↓</button>
            </div>
          </div>

          <div className="col-12 col-md-9">
            {hasQuery ? (
              <>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                  {filteredItems.map((item) => (
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
                          <p className="menu-card-category">{item.sectionTitle}</p>
                        </div>
                        <div className="card-footer menu-card-footer">
                          <span>{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {recommendedItems.length > 0 && (
                  <div className="recommended-section mt-5">
                    <h3>Om du gillar detta... rekommenderar vi</h3>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-2">
                      {recommendedItems.map((item) => (
                        <div className="col" key={`rec-${item.name}`}>
                          <div className="menu-card card h-100 shadow-sm overflow-hidden">
                            <img
                              src={process.env.PUBLIC_URL + "/MAT-IMAGES/" + item.image}
                              alt={item.name}
                              className="menu-card-img-top"
                            />
                            <div className="card-body">
                              <h5>{item.name}</h5>
                              <p className="menu-card-text">{item.description}</p>
                              <p className="menu-card-category">{item.sectionTitle}</p>
                            </div>
                            <div className="card-footer menu-card-footer">
                              <span>{item.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              menuSections.map((section) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
