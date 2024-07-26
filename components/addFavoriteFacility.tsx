import { supabase } from "@/utils/supabase/supabase";

interface AddFavoriteFacilityResponse {
  success: boolean;
  message: string;
}

export async function addFavoriteFacility(userId: string, facilityId: string): Promise<AddFavoriteFacilityResponse> {
  try {
    // ユーザーのfavorite_facilitiesを取得
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('favorite_facilities')
      .eq('id', userId)
      .single();

    if (profileError || !profileData) {
      throw profileError || new Error("プロフィールデータが見つかりません。");
    }

    //
    const favoriteFacilities = profileData.favorite_facilities || [];;

      //デバック用
    console.log(favoriteFacilities);
    console.log(facilityId);
    console.log(favoriteFacilities.includes(facilityId));

    //facilityIdをnumber型に変換
    const facilityIdNumber =  Number(facilityId);

    // すでにお気に入りに登録されているか確認
    if (!favoriteFacilities.includes(facilityIdNumber)) {
      favoriteFacilities.push(facilityIdNumber);
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ favorite_facilities: favoriteFacilities })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return { success: true, message: "お気に入りに登録されました。" };
    } else {
      return { success: false, message: "すでにお気に入りに登録されています。" };
    }
  } catch (error) {
    console.error("Error adding favorite facility:", error.message);
    return { success: false, message: "お気に入り登録に失敗しました。" };
  }
}

export default addFavoriteFacility;
