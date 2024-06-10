'use server'
import { createClient } from "@/utils/supabase/server";
import UserHomepage from "./homepage/user/page";
import ManagerHomepage from "./homepage/manager/page";
import AdminHomePage from "./homepage/admin/page";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const supabase = createClient();
  const { data : { user } } = await supabase.auth.getUser()
  if (!user) {
    return <UserHomepage />
  }

  const { data: User, error } = await supabase
    .from('User')
    .select('user_type')
    .eq('user_id', user.id)
    .returns<{ user_type: string }[]>()
    .single()

  if (!User) {
    // auth.user.id is not in the User table
    console.log("Main page error")
    console.error(error)
    redirect('/auth/signout')
  }

  const user_type = User.user_type.toLowerCase()
  if (user_type == 'facility manager') {
    return <ManagerHomepage />
  }
  else if (user_type == 'admin') {
    return <AdminHomePage />
  }
  else {
    return <UserHomepage />
  }

}
