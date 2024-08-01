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
    let favoriteFacilities= profileData.favorite_facilities || [];

      //デバック用
    console.log(favoriteFacilities);
    console.log(facilityId);
    console.log(favoriteFacilities.includes(facilityId));

    //facilityIdをnumber型に変換
    const facilityIdNumber =  Number(facilityId);
    console.log(facilityIdNumber);

    if (isNaN(facilityIdNumber)) {
      throw new Error("facilityIdが無効です。");
    }

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

      return { success: true, message: "お気に入り登録が完了しました！" };
    } else {
      return { success: false, message: "既にお気に入りに登録されています。" };
    }
  } catch (error) {

    //TypeScript で 'error' が unknown 型であるというエラーが発生する場合、catch ブロックで error の型が unknown であるため
    // エラーが Error 型かどうかをチェック
    if (error instanceof Error) {
      console.error("Error adding favorite facility:", error.message);
      return { success: false, message: "お気に入り登録に失敗しました。" };
    } else {
      // 型が不明な場合のデフォルトのエラーメッセージ
      console.error("Unexpected error adding favorite facility:", error);
      return { success: false, message: "お気に入り登録に失敗しました。" };
    }
  }
}
export default addFavoriteFacility;
