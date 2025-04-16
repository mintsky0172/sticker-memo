import React, { useState, useEffect } from "react";
import MemoBoard from "./components/MemoBoard";
import StickerPanel from "./components/StickerPanel";
import BackgroundSelector from "./components/BackgroundSelector";
import handleSaveImage from "./components/HandleSaveImage";
import HandleCloudSave from "./components/HandleCloudSave";
import ImageModal from "./components/ImageModal";
import { toast, ToastContainer } from "react-toastify";
import { supabase } from "./supabaseClient";
import Login from "./components/Login";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

export default function App() {
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("/backgrounds/기본/grid18.png");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedState, setLoadedState] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchImageList();  
    }
  }, [session]);

  if (!session) {
    return <Login />;
  }

  const handleSelectMemo = (savedState) => {
    console.log("✅ 처리할 state:", savedState);  
  
    const cleanedBackground = savedState.backgroundImage?.replace("/public", "");
  
    setLoadedState({
      backgroundImage: cleanedBackground || "/backgrounds/기본/grid18.png",
      stickers: savedState.stickers || [],
    });
  };

  const fetchImageList = async () => {
    const { data: { user } } = await supabase.auth.getUser();
  
    const { data, error } = await supabase
      .from("memos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
  
    if (error) throw error;
    setImageList(data);

    if (!Array.isArray(data)) {
      toast.error("❌ 불러온 다꾸 리스트가 비어 있어요!");
      return [];
    }
  };
  


  return (
    <div>
       <h2>🎉 로그인 성공!</h2>
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
    </div>
   
  );
}
