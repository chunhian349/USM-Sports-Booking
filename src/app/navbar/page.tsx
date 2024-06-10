'use server'
import NavAction from "./client-side";
import { redirect } from 'next/navigation'
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
    const supabase = createClient();
    const { data: { user }, error: getAuthUserError } = await supabase.auth.getUser()
    if (getAuthUserError || !user) {
        // console.log("Error getting user")
        // console.error(getAuthUserError)
        return <NavAction user_id={''} user_email={''} user_type={'private'} />
    }

    const { data: User, error: selectUserError } = await supabase
        .from('User')
        .select('user_type')
        .eq('user_id', user.id)
        .single()

    //console.log(User)
    if (selectUserError) {
        console.log("Navbar select User failed")
        console.error(selectUserError)
    }
    if (!User) {
        // user.id is not in the User table
        redirect('/auth/signout')
    }
    return <NavAction user_id={user.id} user_email={user.email ? user.email : '(email not found)'} user_type={((User.user_type) as string).toLowerCase()} />
}