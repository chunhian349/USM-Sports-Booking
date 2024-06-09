'use server'
import { createClient } from '@/utils/supabase/server'

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

export async function MakeBooking(facility_id: string, selectedTimeslot: Timeslot[]) {
    const supabase = createClient()

    if (selectedTimeslot.length === 0) {
        return "selectedTimeslot_null"
    }

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
            fk_facility_id: facility_id
        })
        .select()
        .single()

    // Failed booking, redirect to same page for retry
    if (error_booking_data || !booking_data) {
        //console.log("Insert Booking failed")
        // console.error(error_booking_data)
        //redirect('/')
        // return error, then redirect to same page at client component
        return "booking_null"
    }

    const { error: error_bookedTimeslot } = await supabase
        .from('BookedTimeslot')
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
        // console.log("Insert BookedTimeslot failed")
        // console.error(error_booking_data)
        //redirect('/')
        // return error, then redirect to same page at client component
        return "bookedTimeslot_null"
    }

    return booking_data.booking_id as string
}