'use server'
import { createClient } from '@/utils/supabase/server'
import ManagerClient from './client-side'
import { redirect } from 'next/navigation'

export default async function ManagerPage() {
  const supabase = createClient();
  const { data: { user }, error: getAuthUserError } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get sports facility data
  const { data: facilities, error } = await supabase
    .from('SportsFacility')
    .select('facility_id, facility_photo, facility_name, facility_location, sports_category, facility_status, overall_rating')
    .eq('fk_manager_id', user.id)
    .order('facility_created_at')

  if (error) {
    const errorMessage = "ManagerPage select SportsFacility failed (" + error.message + ")"
    redirect('/error/?error=' + errorMessage)
  }

  return <ManagerClient facilities={facilities ? facilities : []}/>
}