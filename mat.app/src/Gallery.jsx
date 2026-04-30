import React from "react";

const images = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.webp",
  "8.jpg",
  "9.jpg",

];

export default function Gallery() {
  return (
    <div className="gallery-page" style={{ background: "#444444", minHeight: "100vh" }}>
      <div className="container-fluid py-4 px-5">
        <div className="gallery-header mb-4">
          <h2 className="text-white" style={{'margin-top: 1000px', 'text-align: left'}}>Galleri</h2>
          <p className="text-white-50">Bilder på mat och dryck från vår galleri.</p>
        </div>

        <div className="row row-cols-3 g-4">
          {images.map((image, index) => (
            <div className="col" key={image}>
              <div className="card h-auto shadow-sm overflow-hidden">
                <img
                  src={process.env.PUBLIC_URL + "/MAT-IMAGES/" + image}
                  className="card-img-top"
                  alt={`Galleri bild ${index + 1}`}
                  style={{ height: "270px", objectFit: "cover", width: "100%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

