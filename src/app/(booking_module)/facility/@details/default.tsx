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
    // if (!user) {
    //     redirect('/login')
    // }

    //console.log("JSON: " + JSON.stringify(facility_id))
    //const paramObj = JSON.parse(JSON.stringify(facility_id))
    const facility_id = searchParams?.facility_id || ''
    //console.log("facility_id: " + paramObj.searchParams.facility_id)

    let { data: result, error } = await supabase
        .from('SportsFacility')
        .select('*')
        .eq('facility_id', facility_id)
        //.eq('fk_manager_id', user?.id)

    if (error) {
        console.error(error)
    }

    //console.log("User id from page: " + user.id)
    return <FacilityDetails facility={result?.at(0)} user_id={user? user.id : null}></FacilityDetails>
}