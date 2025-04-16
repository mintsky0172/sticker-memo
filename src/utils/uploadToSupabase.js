import { supabase } from '../supabaseClient';

export const saveMemo = async ({ imageUrl, state }) => {
  const { error } = await supabase
    .from('memos')
    .insert([{ image_url: imageUrl, state, created_at: new Date().toISOString() }]);

  if (error) {
    console.error('❌ 다꾸 저장 실패:', error.message);
    return false;
  }

  console.log('✅ 다꾸 저장 완료!');
  console.log("저장될 배경:", state.backgroundImage);
  return true;
};
