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

    if (facility_id === '') {
        <FacilityNotFound />
    }

    const supabase = createClient()

    const { data: facilityData, error: selectFacilityError } = await supabase
        .from('SportsFacility')
        .select('facility_start_time, facility_end_time, timeslot_interval')
        .eq('facility_id', facility_id)
        .single()
    
    if (selectFacilityError) {
        if (selectFacilityError) {
            const errorMessage = "Select facility failed (" + selectFacilityError.message + ")"
            redirect('/error/?error=' + errorMessage)
        }
    }

    if (!facilityData) {
        return <FacilityNotFound />
    }

    return (
        <FacilityAvailability 
            facility_id={facility_id}
            facilityData={facilityData}
        />
    )
}