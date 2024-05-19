import { type User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import ManagerClient from './client-side'

export default async function ManagerPage(/*{ user }: { user: User }*/{user_id} : {user_id : string | null}) {
  const supabase = createClient();

  // Get sports facility data
  const { data: facilities, error } = await supabase
    .from('SportsFacility')
    .select('*')
    .eq('fk_manager_id', user_id)

  if (error) {
    console.log("ManagerPage select SportsFacility failed")
    console.error(error)
  }

  return (
    <ManagerClient 
      //user={user} 
      facilities={facilities? facilities: []}
    />
  );
}