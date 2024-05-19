'use server'

import { redirect, usePathname } from 'next/navigation'
import FacilityAvailability from './client-side'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Data from Court table
export type CourtData = {
    court_id: string,
    court_name: string,
    court_status: boolean,
}

// Selected timeslot for booking
export type Timeslot = {
    row: number,
    column: number,
    court_id: string,
    timeslot_date: string,
    timeslot_start: string,
    timeslot_end: string,
    timeslot_rate: number,
    timeslot_index: number,
}


export async function MakeBooking(selectedTimeslot: Timeslot[]) {
    const supabase = createClient()

    const { data : { user } } = await supabase.auth.getUser()
    if (!user) {
        //redirect('/login')
        return "user_null"
    }

    // Insert booking data into Booking table
    const { data: booking_data, error: error_booking_data } = await supabase
        .from('Booking')
        .insert({
            fk_user_id: user.id,
        })
        .select()
        .single()

    // Failed booking, redirect to same page for retry
    if (error_booking_data || !booking_data) {
        console.log("Insert Booking failed")
        console.error(error_booking_data)
        //redirect('/')
        // TODO: return error, then redirect to same page at client component
        return "booking_null"
    }

    const { data: bookedTimeslot, error: error_bookedTimeslot} = await supabase
        .from('BookedTimeSlot')
        .insert(selectedTimeslot.map(timeslot => ({
            timeslot_date: timeslot.timeslot_date,
            timeslot_start: timeslot.timeslot_start,
            timeslot_end: timeslot.timeslot_end,
            timeslot_rate: timeslot.timeslot_rate,
            fk_court_id: timeslot.court_id,
            fk_booking_id: booking_data.booking_id,
            timeslot_index: timeslot.timeslot_index,
        })))

    // Failed booking, redirect to same page for retry
    if (error_bookedTimeslot) {
        console.log("Insert BookedTimeSlot failed")
        console.error(error_booking_data)
        //redirect('/')
        // TODO: return error, then redirect to same page at client component
        return "bookedTimeslot_null"
    }

    return booking_data.booking_id as string
}

export default async function FacilityAvailabilityPage({
    searchParams, 
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    const facility_id = searchParams?.facility_id

    if (!facility_id) {
        redirect('/')
    }

    const supabase = createClient()
    // Retrieve facility data 
    let { data: facility_data, error } = await supabase
        .from('SportsFacility')
        .select('first_timeslot, last_timeslot, timeslot_interval, booking_rates')
        .eq('facility_id', facility_id)
        .single()
    
    if (error || !facility_data) {
        console.log("FacilityAvailability select SportsFacility failed")
        console.error(error)
        redirect('/')
    }

    const { data: auth } = await supabase.auth.getUser()

    if (!auth.user) {
        return (
            <FacilityAvailability 
                facility_id={facility_id}
                facility_data={facility_data}
                user_type={'Private'}
            />
        )
    }

    const { data: User, error: selectUserError } = await supabase
        .from('User')
        .select('user_type')
        .eq('user_id', auth.user.id)
        .single()

    //console.log(User)
    if (selectUserError) {
        console.log("FacilityAvailabilityPage select User failed")
        console.error(selectUserError)
    }
    if (!User) {
        // auth.user.id is not in the User table
        redirect('/auth/signout')
    }

    return (
        <FacilityAvailability 
            facility_id={facility_id}
            facility_data={facility_data}
            user_type={User.user_type}
        />
    )
}