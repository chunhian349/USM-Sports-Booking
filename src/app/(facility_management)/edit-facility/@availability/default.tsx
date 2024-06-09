'use server'

import { redirect } from 'next/navigation'
import FacilityAvailability, { FacilityNotFound } from './client-side'
import { createClient } from '@/utils/supabase/server'

export async function AddCourt(court_name: string, court_status: boolean, facility_id: string/*, formData: FormData*/) {
    const supabase = createClient()
    const { error } = await supabase
        .from('Court')
        .insert({
            court_name: court_name,
            court_status: court_status,
            fk_facility_id: facility_id,
        })

    if (error) {
        const errorMessage = "Add Court failed (" + error.message + ")"
        redirect('/error/?error=' + errorMessage)
    }
}

export async function DeleteCourt(court_id: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('Court')
        .delete()
        .eq('court_id', court_id)

    if (error) {
        const errorMessage = "Delete Court failed (" + error.message + ")"
        redirect('/error/?error=' + errorMessage)
    }
}

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