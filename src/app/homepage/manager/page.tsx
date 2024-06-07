import { createClient } from '@/utils/supabase/server'
import ManagerClient from './client-side'

export default async function ManagerPage({user_id} : {user_id : string | null}) {
  const supabase = createClient();

  // Get sports facility data
  const { data: facilities, error } = await supabase
    .from('SportsFacility')
    .select('facility_id, facility_photo, facility_name, facility_location, sports_category, facility_status, overall_rating')
    .eq('fk_manager_id', user_id)
    .order('facility_created_at')

  if (error || !facilities) {
    console.log("ManagerPage select SportsFacility failed")
    console.error(error)
    return <ManagerClient facilities={[]} />
  }

  return <ManagerClient facilities={facilities}/>
}