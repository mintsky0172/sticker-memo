import { supabase } from './supabaseClient';

export const getImageList = async () => {
  const { data, error } = await supabase
    .from("memos")
    .select("id, image_url, state, created_at")

  console.log(data);

  if (error) {
    console.error('❌ 리스트 가져오기 실패:', error.message);
    return [];
  }

  return data;
};

export const getPublicUrl = (fileName) => {
  return supabase
    .storage
    .from('images')
    .getPublicUrl(`memos/${fileName}`)
    .data.publicUrl;
};
