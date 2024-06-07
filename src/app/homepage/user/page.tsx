import { createClient } from '@/utils/supabase/server'
import UserClient from './client-side'

export default async function UserPage() {
  const supabase = createClient();

  // Get sports facility data
  const { data: facilities, error } = await supabase
    .from('SportsFacility')
    .select('facility_id, facility_photo, facility_name, facility_location, sports_category, facility_status, overall_rating')
    .eq('facility_status', true)
    .order('facility_created_at')

  if (error || !facilities) {
    console.log("UserPage select SportsFacility failed")
    console.error(error)
    return <UserClient facilities={[]} />
  }

  return <UserClient facilities={facilities}/>
}