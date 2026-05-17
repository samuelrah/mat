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
        {["payment"].map((section) => (
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
      </div>
      </div>
    </>
  );
}
