import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabase';

interface Facility {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const useFavoriteFacilities = (userId: string) => {
  const [favoriteFacilities, setFavoriteFacilities] = useState<Facility[]>([]);
  
  useEffect(() => {
    const fetchFavoriteFacilities = async () => {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('favorite_facilities')
        .eq('id', userId)
        .single();

      if (profileError || !profileData) {
        console.error('Error fetching profile data:', profileError?.message);
        return;
      }

      const favoriteFacilityIds = profileData.favorite_facilities || [];

      if (favoriteFacilityIds.length === 0) {
        console.log('No favorite facilities found');
        setFavoriteFacilities([]); // 明示的に空の配列を設定
        return;
      }

      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('tasks')
        .select('*')
        .in('id', favoriteFacilityIds);

      if (facilitiesError) {
        console.error('Error fetching facilities:', facilitiesError.message);
        return;
      }

      setFavoriteFacilities(facilitiesData);
    };

    fetchFavoriteFacilities();
  }, [userId]);

  return favoriteFacilities.map((facility) => ({
    id: facility.id,
    name: facility.name,
    lat: facility.latitude,
    lng: facility.longitude,
  }));
};

export default useFavoriteFacilities;
