
import { supabase } from "@/utils/supabase/supabase";

const getProfileId = async () => {
  // セッションから現在のユーザー情報を取得
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Error fetching session:', sessionError.message);
    return null;
  }

  if (!session) {
    console.error('No active session found');
    return null;
  }

  const user = session.user;

  // profilesテーブルからユーザーのプロフィールIDを取得
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (profilesError) {
    console.error('Error fetching profile ID:', profilesError.message);
    return null;
  }

  return profiles?.id || null;
};

export default getProfileId;
