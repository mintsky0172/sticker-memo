import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";

Modal.setAppElement("#root");

const ImageModal = ({
  isOpen,
  onRequestClose,
  onLoadMemo,
  fetchImageList,
}) => {
  const [displayList, setDisplayList] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("memos").delete().eq("id", id);
      if (error) throw error;
  
      toast.success("🗑️ 삭제했어요!");
  
      await fetchImageList(); 
    } catch (err) {
      console.error("삭제 실패:", err);
      toast.error("❌ 삭제에 실패했어요");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchImageList();
      setDisplayList(data);
    };

    if (isOpen) loadData();
  }, [isOpen, fetchImageList]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>📂 저장된 다꾸</h2>
      <button onClick={() => setDeleteMode((prev) => !prev)}>
        {deleteMode ? "✅ 삭제 모드 끄기" : "🗑 삭제 모드 켜기"}
      </button>
      <button onClick={onRequestClose} style={{ marginTop: "20px" }}>
        닫기
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "12px",
          padding: "12px",
        }}
      >
        {displayList.map((item) => (
          <div key={item.id} style={{ textAlign: "center" }}>
            <img
              src={item.image_url}
              alt="다꾸 미리보기"
              style={{ width: "100px", cursor: "pointer", marginBottom: "8px" }}
              onClick={() => {
                onRequestClose();
              
                const parsedState =
                  typeof item.state === "string" ? JSON.parse(item.state) : item.state;
              
                onLoadMemo(parsedState); 
                console.log("✅ 선택된 다꾸:", parsedState);

              }}
              
            />

            {deleteMode && (
              <button onClick={() => handleDelete(item.id)}>삭제</button>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ImageModal;
