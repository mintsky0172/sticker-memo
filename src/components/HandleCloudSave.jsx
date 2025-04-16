import { supabase } from "../supabaseClient";
import { saveMemo } from "../utils/uploadToSupabase";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HandleCloudSave({ backgroundImage, onSaveComplete }) {
  const handleClick = async () => {
    try {
      const board = document.getElementById("memo-board");
      if (!board) throw new Error("메모판을 찾을 수 없어요!");

      const canvas = await html2canvas(board);
      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject("Blob 생성 실패")),
          "image/png"
        )
      );

      const fileName = `memo_${Date.now()}.png`;
      const filePath = `memos/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, blob, { contentType: "image/png" });

      if (uploadError) {
        toast.error("❌ 업로드 실패");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);
      const imageUrl = publicUrlData?.publicUrl;

      if (!imageUrl) {
        toast.error("❌ 이미지 URL 없음");
        return;
      }

      const saved = JSON.parse(localStorage.getItem("stickers") || "{}");
      const stickers = Array.isArray(saved) ? saved : saved.stickers || [];

      const cleanedBackground = backgroundImage.startsWith("/public")
        ? backgroundImage.replace("/public", "")
        : backgroundImage;

      const state = {
        backgroundImage: cleanedBackground,
        stickers,
      };

      console.log("💾 저장될 배경:", backgroundImage.replace("/public", ""));

      const result = await saveMemo({ imageUrl, state });

      if (result) {
        toast.success("✅클라우드에 저장되었어요!");
        if (onSaveComplete) onSaveComplete();
      } else {
        toast.error("❌클라우드 저장에 실패했어요!");
      }
    } catch (err) {
      console.error("❌저장 중 오류: ", err);
      toast.error("❌클라우드 저장에 실패했어요!");
    }
  };

  return <button onClick={handleClick}>클라우드에 저장</button>;
}
