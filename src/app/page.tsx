import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import UserHomepage from "./homepage/user/page";
import ManagerHomepage from "./homepage/manager/page";

export default async function AppPage() {
  const supabase = createClient();
  const { data : { user } } = await supabase.auth.getUser()

  return (
      // (!user || 'user_type' in user) ? (
      //  <UserHomepage user={user} />
      // ) : (
      //  <ManagerHomepage user={user} />
      // )

      (user?.email == 'chunhian349@gmail.com') ? (
        <ManagerHomepage user={user} />
      ) : (
        <UserHomepage user={user} />
      )

  );
}
