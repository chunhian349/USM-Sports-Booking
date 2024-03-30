import { createClient } from "@/utils/supabase/server";
import NavAction from "./client-side";

export default async function Navbar() {
    const supabase = createClient()
    const { data : { user } } = await supabase.auth.getUser()
	return <NavAction user={user} />
}