import { supabase } from "../supabaseClient";
import { saveMemo } from "../utils/uploadToSupabase";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HandleCloudSave({ backgroundImage, onSaveComplete }) {
  const handleClick = async () => {
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

    const cleanedBackground = backgroundImage.startsWith("/backgrounds")
      ? backgroundImage
      : `/backgrounds${backgroundImage}`;

    console.log("📁 실제 저장될 배경:", cleanedBackground);

    const state = {
      backgroundImage: cleanedBackground,
      stickers,
    };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const user_id = user?.id;

    const result = await saveMemo({ imageUrl, state, user_id });

    if (result) {
      toast.success("✅클라우드에 저장되었어요!");
      if (onSaveComplete) onSaveComplete();
    } else {
      toast.error("❌클라우드 저장에 실패했어요!");
    }
  };

  return <button onClick={handleClick}>클라우드에 저장</button>;
}
