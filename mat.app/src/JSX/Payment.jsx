import React, { useState } from "react";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("payment");

  const handleClick = (section) => {
    setActiveSection(section);
  };

  return (
    <>

      <div className="container">
      <nav>
        {["payment", "profile", "subscription", "privacy"].map((section) => (
          <a
            key={section}
            href="#"
            className={activeSection === section ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              handleClick(section);
            }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </a>
        ))}
      </nav>

      <div className="rightbox">
        <div className={`payment ${activeSection === "payment" ? "" : "noshow"}`}>
          Payment content
        </div>
        <div className={`profile ${activeSection === "profile" ? "" : "noshow"}`}>
          Profile content
        </div>
        <div className={`subscription ${activeSection === "subscription" ? "" : "noshow"}`}>
          Subscription content
        </div>
        <div className={`privacy ${activeSection === "privacy" ? "" : "noshow"}`}>
          Privacy content
        </div>
      </div>
      </div>
    </>
  );
}
