'use server'

import { redirect } from 'next/navigation'
import FacilityAvailability from './client-side'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const supabase = createClient()

export default async function FacilityAvailabilityPage({
    searchParams, 
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    const facility_id = searchParams?.facility_id || ''

    // Retrieve facility data 
    let { data: facility_data, error } = await supabase
        .from('SportsFacility')
        .select('first_timeslot, last_timeslot, timeslot_interval, booking_rates')
        .eq('facility_id', facility_id)

    if (error || !facility_data) {
        console.error(error)
        return redirect('/404')
    }

    return (
        <FacilityAvailability 
            facility_id={facility_id}
            facility_data={facility_data[0]}
        />
    )
}