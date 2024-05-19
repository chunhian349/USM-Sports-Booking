import { createClient } from "@/utils/supabase/server";
import UserHomepage from "./homepage/user/page";
import ManagerHomepage from "./homepage/manager/page";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const supabase = createClient();
  const { data : { user } } = await supabase.auth.getUser()
  if (!user) {
    return <UserHomepage user_id={null} />
  }

  const { data: User, error } = await supabase
    .from('User')
    .select('user_type')
    .eq('user_id', user.id)
    .single()

  if (!User) {
    // auth.user.id is not in the User table
    console.log("Main page error")
    console.error(error)
    redirect('/auth/signout')
  }

  return (
    (User.user_type == 'Facility Manager') ? (
      <ManagerHomepage user_id={user.id} />
    ) : (
      <UserHomepage user_id={user.id} />
    )
  );
}
