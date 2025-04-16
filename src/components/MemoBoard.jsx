import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "./MemoBoard.css";

export default function MemoBoard({ selectedSticker, backgroundImage, loadedState, setBackgroundImage }) {
  const [stickers, setStickers] = useState([]);
  const boardRef = useRef(null);
  const [history, setHistory] = useState([]);

  const updateSticker = (id, updates) => {
    setHistory((prev) => [...prev, stickers]);
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteSticker = (id) => {
    setHistory((prev) => [...prev, stickers]);
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const undo = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setStickers(previous);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const clearStickers = () => {
    setStickers([]);
    toast.success("🧹 스티커를 모두 지웠어요!");
  };

  const addSticker = (src) => {
    const id = Date.now();
    setStickers((prev) => [
      ...prev,
      {
        id,
        src,
        x: 100,
        y: 100,
        scale: 1,
        rotation: 0,
        isSelected: false,
        zIndex: 0,
      },
    ]);
  };

  useEffect(() => {
    if (selectedSticker) {
      addSticker(selectedSticker);
    }
  }, [selectedSticker]);

  useEffect(() => {
    if (loadedState) {
      console.log("✅ loadedState:", loadedState);
      setStickers(
        Array.isArray(loadedState.stickers)
          ? loadedState.stickers
          : loadedState.stickers?.stickers || []
      );
      setBackgroundImage("/public" + loadedState.backgroundImage); 

    }
  }, [loadedState]);
  
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "loadedMemo") {
        const saved = localStorage.getItem("loadedMemo");
        if (saved) {
          const { backgroundImage, stickers, trigger } = JSON.parse(saved);
  
          setBackgroundImage(backgroundImage);
          setStickers(stickers);
  
          if (trigger === "manual") {
            toast.success("📥 저장한 다꾸를 불러왔어요!");
          }
  
          localStorage.removeItem("loadedMemo");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("stickers", JSON.stringify(stickers));
  }, [stickers]);
  
  useEffect(() => {
    const handleStorageLoad = () => {
      const saved = localStorage.getItem("loadedMemo");
      if (saved) {
        const parsed = JSON.parse(saved);
        const { backgroundImage, stickers } = parsed;

        setBackgroundImage(backgroundImage || "/backgrounds/기본/grid18.png");
        setStickers(
          Array.isArray(stickers) ? stickers : stickers?.stickers || []
        );
        localStorage.removeItem("loadedMemo"); 
      }
    };
  
    window.addEventListener("storage", handleStorageLoad);
    return () => window.removeEventListener("storage", handleStorageLoad);
  }, []);
  
  
  const bringToFront = (id) => {
    const maxZ = Math.max(...stickers.map((s) => s.zIndex));
    updateSticker(id, { zIndex: maxZ + 1 });
  };

  const sendToBack = (id) => {
    const minZ = Math.min(...stickers.map((s) => s.zIndex));
    updateSticker(id, { zIndex: minZ - 1 });
  };

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    const sticker = stickers.find((s) => s.id === id);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      updateSticker(id, {
        x: sticker.x + dx,
        y: sticker.y + dy,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e, id) => {
    e.stopPropagation();
    const sticker = stickers.find((s) => s.id === id);
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
  
    const handleTouchMove = (moveEvent) => {
      const dx = moveEvent.touches[0].clientX - startX;
      const dy = moveEvent.touches[0].clientY - startY;
      updateSticker(id, {
        x: sticker.x + dx,
        y: sticker.y + dy,
      });
    };
  
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };
  

  return (
    <div className = "container">
    <div
      id="memo-board"
      ref={boardRef}
      style={{
        width: "360px",
        height: "600px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
        margin: "0 auto",
      }}
      onClick={() =>
        setStickers((prev) => prev.map((s) => ({ ...s, isSelected: false })))
      }
    >
      {stickers.map((sticker) => (
        <div key={sticker.id}>
          <div
            onMouseDown={(e) => handleMouseDown(e, sticker.id)}
            onTouchStart={(e) => handleTouchStart(e, sticker.id)}
            onClick={(e) => {
              e.stopPropagation();
              setStickers((prev) =>
                prev.map((s) =>
                  s.id === sticker.id
                    ? { ...s, isSelected: true }
                    : { ...s, isSelected: false }
                )
              );
            }}
            style={{
              position: "absolute",
              zIndex: sticker.zIndex,
              left: sticker.x,
              top: sticker.y,
              transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
              transformOrigin: "center",
              cursor: "grab",
            }}
          >
            <img
              src={sticker.src}
              alt=""
              style={{ width: "80px", userSelect: "none" }}
              draggable={false}
            />
          </div>

          {sticker.isSelected && (
            <div
              style={{
                position: "absolute",
                left: sticker.x + 40,
                top: sticker.y + 50,
                transform: `translateX(-50%)`,
                width: "max-content",
                display: "flex",
                gap: "4px",
                zIndex: 10,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateSticker(sticker.id, {
                    rotation: sticker.rotation + 15,
                  });
                }}
              >
                ⟳
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateSticker(sticker.id, { scale: sticker.scale + 0.1 });
                }}
              >
                ＋
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateSticker(sticker.id, {
                    scale: Math.max(sticker.scale - 0.1, 0.1),
                  });
                }}
              >
                －
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSticker(sticker.id);
                }}
              >
                ❌
              </button>
              <button onClick={() => bringToFront(sticker.id)}>⬆</button>
              <button onClick={() => sendToBack(sticker.id)}>⬇</button>
            </div>
          )}
        </div>
      ))}

    
    </div>
    <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "10px",
        }}
        className = "controls"
      >
        <button onClick={undo}>⎌ 되돌리기</button>
        <button onClick={clearStickers}>🗑 전체 삭제</button>
      </div>
    </div>
  );
}
