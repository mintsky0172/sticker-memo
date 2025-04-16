import { supabase } from "../supabaseClient";

const loadMemo = async () => {
  try {
    const { data, error } = await supabase.from("memos").select("*");

    if (error || !data || data.length === 0) {
      throw new Error("불러올 데이터가 없어요!");
    }

    return data;
  } catch (err) {
    console.error("불러오기 실패:", err);
    throw err; 
  }
};

export default loadMemo;
