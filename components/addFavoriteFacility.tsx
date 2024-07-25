export async function addFavoriteFacility(userId: string, facilityId: string) {
  try {
    // 現在のユーザーのプロフィールを取得
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('favorite_facilities')
      .eq('id', userId)
      .single();

    if (profileError || !profileData) {
      throw profileError;
    }

    const favoriteFacilities = profileData.favorite_facilities || [];

    // すでにお気に入りに登録されているか確認
    if (!favoriteFacilities.includes(facilityId)) {
      favoriteFacilities.push(facilityId);
    }

    // プロフィールのfavorite_facilitiesを更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ favorite_facilities: favoriteFacilities })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return true;
  } catch (error) {
    console.error("Error adding favorite facility:", error.message);
    return false;
  }
}

export default addFavoriteFacility;