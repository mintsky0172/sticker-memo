import React, { useState, useEffect } from "react";
import "./BackgroundSelector.css";
import backgroundList from "../data/backgroundList";

const categories = ["기본", "체크", "데코", "풍경"];
const ITEMS_PER_PAGE = 8;

export default function BackgroundSelector({ onSelectBackground }) {
  const [selectedCategory, setSelectedCategory] = useState("기본");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSrc, setSelectedSrc] = useState(null);

  const filtered = backgroundList.filter(
    (bg) => bg.category === selectedCategory
  );

  const paged = filtered.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleSelect = (background) => {
    setSelectedSrc(background.src);
    onSelectBackground(background.originalPath);
    console.log("선택된 배경 경로:", background.originalPath);
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
        {paged.map((background, idx) => (
          <img
            key={idx}
            src={background.src}
            className={`background-thumb ${background.src === selectedSrc ? "selected" : ""}`}
            onClick={() => handleSelect(background.src)}
            alt={background.name}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
            disabled={currentPage === 0}
          >
            ◀
          </button>
          <span>
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
