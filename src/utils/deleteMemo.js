import { supabase } from "../supabaseClient";

export const deleteMemo = async (id) => {
  const { error } = await supabase.from("memos").delete().eq("id", id);

  if (error) {
    console.error("❌ 삭제 실패:", error.message);
    return false;
  }

  return true;
};
