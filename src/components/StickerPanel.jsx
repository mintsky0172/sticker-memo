import React, { useState, useEffect } from "react";
import "./StickerPanel.css";

const stickerModules = import.meta.glob("/public/stickers/*/*.png", {
  eager: true,
  as: "url",
});

const allStickers = Object.entries(stickerModules).map(([path, src]) => {
  const match = path.match(/\/stickers\/([^/]+)\/([^/]+)\.png$/);
  if (!match) return null;

  const [, category, filename] = match;
  return {
    src,
    category,
    name: filename,
  };
}).filter(Boolean);

const categories = ["음식", "일상", "데코", "기타"];

export default function StickerPanel({ onSelectSticker }) {
  const [selectedCategory, setSelectedCategory] = useState("음식");
  const [currentPage, setCurrentPage] = useState(0);
  const stickersPerPage = 8;

  const filtered = allStickers.filter(s => s.category === selectedCategory);
  const totalPages = Math.ceil(filtered.length / stickersPerPage);
  const paged = filtered.slice(currentPage * stickersPerPage, (currentPage + 1) * stickersPerPage);

  useEffect(() => {
    setCurrentPage(0); 
  }, [selectedCategory]);

  return (
    <div className="sticker-panel-wrapper">
      <h4>스티커 선택</h4>
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="sticker-panel">
        {paged.map((sticker, index) => (
          <img
            key={index}
            src={sticker.src}
            alt={sticker.name}
            className="sticker-thumb"
            onClick={() => onSelectSticker(sticker.src)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} disabled={currentPage === 0}>◀</button>
          <span>{currentPage + 1} / {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>▶</button>
        </div>
      )}
    </div>
  );
}
