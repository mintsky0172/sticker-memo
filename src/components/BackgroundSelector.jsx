import React, { useState, useEffect } from "react";
import "./BackgroundSelector.css";

const backgroundModules = import.meta.glob("/public/backgrounds/*/*.png", {
  eager: true,
  as: "url",
});

const allBackgrounds = Object.entries(backgroundModules)
  .map(([path, src]) => {
    const match = path.match(/\/backgrounds\/([^/]+)\/([^/]+)\.png$/);
    if (!match) return null;
    const [, category, filename] = match;

    return {
      src, 
      originalPath: `/backgrounds/${category}/${filename}.png`, 
      category,
      name: filename,
    };
  })
  .filter(Boolean);

const categoryMap = {
  basic: "기본",
  check: "체크",
  deco: "데코",
  scenery: "풍경"
};

const categories = Object.values(categoryMap);

const ITEMS_PER_PAGE = 8;

export default function BackgroundSelector({ onSelectBackground }) {
  const [selectedCategory, setSelectedCategory] = useState("모눈");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSrc, setSelectedSrc] = useState(null);


  
  const selectedKey = Object.keys(categoryMap).find(
    (key) => categoryMap[key] === selectedCategory
  );

  const filtered = allBackgrounds.filter(
    (background) => background.category === selectedKey
  );

  const paged = filtered.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleSelect = (background) => {
    setSelectedSrc(background.src);
    onSelectBackground(background.src);
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
            className={`background-thumb ${
              background.src === selectedSrc ? "selected" : ""
            }`}
            onClick={() => handleSelect(background)} // ❗ 객체 통째로 넘김
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
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
