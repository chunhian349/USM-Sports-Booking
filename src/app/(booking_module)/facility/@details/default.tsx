'use server'
import { createClient } from '@/utils/supabase/server'
import FacilityDetails from './client-side'
import { redirect } from 'next/navigation'
import { type FacilityData } from '@/app/(facility_management)/edit-facility/@details/default'

export default async function FacilityDetailsPage({
    searchParams,
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    let user_type = 'private';

    if (user) {
        const { data: User, error: selectUserError } = await supabase
        .from('User')
        .select('user_type')
        .eq('user_id', user.id)
        .single()

        if (User && User.user_type) {
            user_type = (User.user_type as string).toLowerCase()
        } 
        
        if (selectUserError) {
            const errorMessage = "Failed to get user data (" + selectUserError.message + ")"
            redirect('/error/?error=' + errorMessage)
        }
    }

    const facility_id = searchParams?.facility_id || ''

    const { data: facilityData, error: selectFacilityError } = await supabase
        .from('SportsFacility')
        .select('facility_id, facility_photo, facility_name, facility_location, sports_category, phone_num, facility_status, facility_desc, booking_rates')
        .eq('facility_id', facility_id)
        .single()

    if (selectFacilityError) {
        const errorMessage = "Retrieve sports facility detials failed (" + selectFacilityError.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    return <FacilityDetails facilityData={ facilityData } user_type={user_type}></FacilityDetails>
}