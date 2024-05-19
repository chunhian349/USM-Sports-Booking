import NavAction from "./client-side";
import { redirect } from 'next/navigation'
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
    const supabase = createClient();
    const { data: auth, /*error: getAuthUserError*/ } = await supabase.auth.getUser()
    // if (getUserResult.error) {
    //     console.log("Error getting user")
    //     console.error(getUserResult.error)
    // }
    if (!auth.user) {
        return <NavAction user_id={null} user_email={null} user_type={null} />
    }

    const { data: User, error: selectUserError } = await supabase
        .from('User')
        .select('user_type')
        .eq('user_id', auth.user.id)
        .single()

    //console.log(User)
    if (selectUserError) {
        console.log("Navbar select User failed")
        console.error(selectUserError)
    }
    if (!User) {
        // auth.user.id is not in the User table
        redirect('/auth/signout')
    }
    return <NavAction user_id={auth.user.id} user_email={auth.user.email ? auth.user.email : null} user_type={User.user_type} />
}