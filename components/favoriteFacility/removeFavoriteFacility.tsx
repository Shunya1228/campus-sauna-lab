import { supabase } from "@/utils/supabase/supabase";

interface RemoveFavoriteFacilityResponse {
  success: boolean;
  message: string;
}

export async function removeFavoriteFacility(userId: string, facilityId: string): Promise<RemoveFavoriteFacilityResponse> {
  try {
    // 現在のユーザーのプロフィールを取得
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('favorite_facilities')
      .eq('id', userId)
      .single();

    if (profileError || !profileData) {
      throw profileError || new Error("プロフィールデータが見つかりません。");
    }

    let favoriteFacilities = profileData.favorite_facilities || [];

    //facilityIdをnumber型に変換
    const facilityIdNumber =  Number(facilityId);

    // お気に入りに登録されているか確認
    if (favoriteFacilities.includes(facilityIdNumber)) {
      favoriteFacilities = favoriteFacilities.filter((id: number) => id !== facilityIdNumber); //filter 関数を使用して、facilityId と一致しない要素だけを含む新しい配列を作成
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ favorite_facilities: favoriteFacilities })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return { success: true, message: "お気に入り解除が完了しました。" };
    } else {
      return { success: false, message: "お気に入りに登録されていません。" };
    }
  } catch (error) {
    console.error("Error removing favorite facility:", error.message);
    return { success: false, message: "お気に入り解除に失敗しました。" };
  }
}

export default removeFavoriteFacility;
