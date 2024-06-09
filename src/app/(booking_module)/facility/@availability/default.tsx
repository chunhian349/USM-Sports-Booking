'use server'

import { redirect } from 'next/navigation'
import FacilityAvailability from './client-side'
import  FacilityNotFound  from '@/app/UI/facility-not-found'
import { createClient } from '@/utils/supabase/server'

export default async function FacilityAvailabilityPage({
    searchParams, 
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    const facility_id = searchParams?.facility_id ?? ''

    if (facility_id == '') {
        return <FacilityNotFound />
    }

    const supabase = createClient()
    // Retrieve facility data 
    const { data: facilityData, error: selectFacilityError } = await supabase
        .from('SportsFacility')
        .select('facility_start_time, facility_end_time, timeslot_interval, booking_rates')
        .eq('facility_id', facility_id)
        .single()
    
    if (selectFacilityError) {
        const errorMessage = "Retrieve sports facility data failed (" + selectFacilityError.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    if (!facilityData) {
        return <FacilityNotFound />
    }

    const { data: auth } = await supabase.auth.getUser()

    // Show private rate
    if (!auth.user) {
        return (
            <FacilityAvailability 
                facility_id={facility_id}
                facilityData={facilityData}
                user_type={'Private'}
            />
        )
    }

    const { data: User, error: selectUserError } = await supabase
        .from('User')
        .select('user_type')
        .eq('user_id', auth.user.id)
        .single()

    if (selectUserError) {
        const errorMessage = "Retrieve user data failed in facility availability page (" + selectUserError.message + ")"
        redirect('/error/?error=' + errorMessage)
    }
    if (!User) {
        redirect('/error/?error=No user data found for the current user. Please contact the administrator.')
    }

    return (
        <FacilityAvailability 
            facility_id={facility_id}
            facilityData={facilityData}
            user_type={User.user_type}
        />
    )
}