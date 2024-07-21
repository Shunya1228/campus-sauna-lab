import { supabase } from "@/utils/supabase/supabase";

export const getFacility = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*');

  if (error) {
    console.error('Error fetching facilities:', error);
    return [];
  }

  return data.map((facility) => ({
    id: facility.id,
    name: facility.name,
    lat: facility.latitude,
    lng: facility.longitude,
    fee: facility.fee,
    openinghours: facility.openinghours,
  }));
};

export default getFacility;
