import React, { useState, useEffect } from "react";
import MemoBoard from "./components/MemoBoard";
import StickerPanel from "./components/StickerPanel";
import BackgroundSelector from "./components/BackgroundSelector";
import handleSaveImage from "./components/HandleSaveImage";
import HandleCloudSave from "./components/HandleCloudSave";
import ImageModal from "./components/ImageModal";
import { toast, ToastContainer } from "react-toastify";
import { supabase } from "./supabaseClient";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

export default function App() {
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("/backgrounds/기본/grid18.png");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedState, setLoadedState] = useState(null);
  const [imageList, setImageList] = useState([]);

  const handleSelectMemo = (savedState) => {
    console.log("✅ 처리할 state:", savedState);  // 여기 state 전체가 들어옴
  
    const cleanedBackground = savedState.backgroundImage?.replace("/public", "");
  
    setLoadedState({
      backgroundImage: cleanedBackground || "/backgrounds/기본/grid18.png",
      stickers: savedState.stickers || [],
    });
  };
  
  
  
  

  const fetchImageList = async () => {
    try {
      const { data, error } = await supabase.from("memos").select("*");
      if (error) throw error;
      setImageList(data);
      return data; 
    } catch (err) {
      console.error("❌ 불러오기 오류:", err);
      toast.error("❌ 저장된 다꾸를 불러오지 못했어요");
      return [];
    }
  };
  

  useEffect(() => {
    fetchImageList();
  }, []);

  return (
    <div className="app-container">
      <img src="/logo.png" alt="로고" className="logo" />

      <MemoBoard
        selectedSticker={selectedSticker}
        backgroundImage={backgroundImage}
        loadedState={loadedState}
        setBackgroundImage={setBackgroundImage}
      />

      <StickerPanel onSelectSticker={setSelectedSticker} />
      <BackgroundSelector onSelectBackground={setBackgroundImage} />

      <div className="save-button-wrapper">
        <button className="save-button" onClick={handleSaveImage}>
          이미지 다운로드
        </button>

        <HandleCloudSave
          backgroundImage={backgroundImage}
          onSaveComplete={fetchImageList}
        />

        <div>
          <button onClick={() => setIsModalOpen(true)}>
            📸 저장된 다꾸 보기
          </button>
          <ImageModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onLoadMemo={handleSelectMemo}
            imageList={imageList} 
            fetchImageList={fetchImageList}  
          />
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
