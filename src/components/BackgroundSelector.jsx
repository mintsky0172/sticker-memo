import React, { useState, useEffect } from "react";
import "./BackgroundSelector.css";

const backgroundModules = import.meta.glob("/public/backgrounds/*/*.png", {
  eager: true,
  as: "url",
});

const allBackgrounds = Object.entries(backgroundModules).map(([path, src]) => {
  const match = path.match(/\/backgrounds\/([^/]+)\/([^/]+)\.png$/);
  if (!match) return null;

  const [, category, filename] = match;
  return {
    src,
    category,
    name: filename,
  };
}).filter(Boolean);

const categories = ["기본", "체크", "데코", "풍경"];
const ITEMS_PER_PAGE = 8;

export default function BackgroundSelector({ onSelectBackground }) {
  const [selectedCategory, setSelectedCategory] = useState("모눈");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSrc, setSelectedSrc] = useState(null);

  const filtered = allBackgrounds.filter((bg) => bg.category === selectedCategory);
  const paged = filtered.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleSelect = (src) => {
    setSelectedSrc(src);
    onSelectBackground(src);
  };

  useEffect(() => {
    setCurrentPage(0); 
  }, [selectedCategory]);

  return (
    <div className="background-panel-wrapper">
      <h3>🧵 배경 선택</h3>
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            className={cat === selectedCategory ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="background-panel">
        {paged.map((bg, idx) => (
          <img
            key={idx}
            src={bg.src}
            className={`background-thumb ${bg.src === selectedSrc ? "selected" : ""}`}
            onClick={() => handleSelect(bg.src)}
            alt={bg.name}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))} disabled={currentPage === 0}>◀</button>
          <span>{currentPage + 1} / {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>▶</button>
        </div>
      )}
    </div>
  );
}
