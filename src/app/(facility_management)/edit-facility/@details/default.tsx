'use server'
import { createClient } from '@/utils/supabase/server'
import EditFacility from './client-side'
import { redirect } from 'next/navigation'

export default async function EditFacilityPage({
    searchParams,
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    const supabase = createClient()
    const { data : { user }} = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const facility_id = searchParams?.facility_id || ''

    const { data: facilityData, error: selectFacilityError } = await supabase
        .from('SportsFacility')
        .select('facility_id, facility_photo, facility_name, facility_location, sports_category, phone_num, facility_status, facility_desc, booking_rates')
        .eq('facility_id', facility_id)
        .single()

    if (selectFacilityError || !facilityData) {
        const errorMessage = "Retrieve sports facility data failed (" + selectFacilityError.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    return <EditFacility facilityData={facilityData} user_id={user.id}></EditFacility>
}