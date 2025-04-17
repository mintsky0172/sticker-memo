import { supabase } from '../supabaseClient';

export const saveMemo = async ({ imageUrl, state, user_id }) => {
  const { error } = await supabase.from("memos").insert([
    {
      image_url: imageUrl,
      state: state,
      user_id: user_id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("❌ 저장 실패:", error.message);
    return false;
  }

  return true;
};


