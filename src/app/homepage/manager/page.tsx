'use server'
import { createClient } from '@/utils/supabase/server'
import ManagerClient from './client-side'
import { redirect } from 'next/navigation'
import { NextPage } from 'next'

interface ManagerPageProps {
  user_id: string;
}

const ManagerPage: NextPage<ManagerPageProps> = async ({ user_id }: ManagerPageProps) => {
  const supabase = createClient();

  // Get sports facility data
  const { data: facilities, error } = await supabase
    .from('SportsFacility')
    .select('facility_id, facility_photo, facility_name, facility_location, sports_category, facility_status, overall_rating')
    .eq('fk_manager_id', user_id)
    .order('facility_created_at')

  if (error) {
    const errorMessage = "ManagerPage select SportsFacility failed (" + error.message + ")"
    redirect('/error/?error=' + errorMessage)
  }

  return <ManagerClient facilities={facilities ? facilities : []}/>
};

export default ManagerPage;