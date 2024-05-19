'use server'
import { createClient } from '@/utils/supabase/server'
import FacilityDetails from './client-side'
import { redirect } from 'next/navigation'

const supabase = createClient()

export default async function FacilityDetailsPage({
    searchParams,
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    
    const { data : { user }} = await supabase.auth.getUser()

    const facility_id = searchParams?.facility_id || ''

    let { data: result, error } = await supabase
        .from('SportsFacility')
        .select('*')
        .eq('facility_id', facility_id)
        .single()

    if (error) {
        console.log("FacilityDetails select SportsFacility failed")
        console.error(error)
        redirect('/')
    }

    //console.log("User id from page: " + user.id)
    return <FacilityDetails facility={result} user_id={user? user.id : null}></FacilityDetails>
}