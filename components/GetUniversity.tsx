import { supabase } from "@/utils/supabase/supabase";

export const getUniversities = async () => {
  const { data, error } = await supabase
    .from('University')
    .select('name, latitude, longitude');

  if (error) {
    console.error('Error fetching universities:', error);
    return [];
  }

  return data.map((university) => ({
    name: university.name,
    lat: university.latitude,
    lng: university.longitude
  }));
};

export default getUniversities;
