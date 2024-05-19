import { type User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import UserClient from './client-side'

export default async function UserPage(/*{ user }: { user: User | null }*/ {user_id} : {user_id : string | null}) {
  const supabase = createClient();

  // Get sports facility data
  const { data: facilities, error } = await supabase
    .from('SportsFacility')
    .select('*')
    .eq('facility_status', true)

  if (error) {
    console.log("UserPage select SportsFacility failed")
    console.error(error)
  }

  return (
    <UserClient 
      //user={user} 
      facilities={facilities? facilities: []}
    />
  );
}