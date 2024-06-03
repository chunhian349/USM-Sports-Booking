'use server'
import { BookingSummaryData } from "../summary/page"
import BookingSuccess from "./client-side"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function BookingSuccessPage({
    searchParams,
} : {
    searchParams? : {
        booking_id: string
    }
}) {
    const booking_id = searchParams?.booking_id
    if (!booking_id) {
        console.log("No booking_id found at booking summary page")
        redirect('/')
    }

    const supabase = createClient()
    const { data: bookingData, error: selectBookingError } = await supabase
        .from('Booking')
        .select('booking_id, transaction_time, transaction_amount, transaction_method')
        .eq('booking_id', booking_id)
        .single()

    if (selectBookingError || !bookingData) {
        console.log("Select Booking failed at booking summary page")
        console.error(selectBookingError)
        redirect('/')
    }

    const { data: bookedTimeslot, error: selectTimeslotError } = await supabase
        .from('BookedTimeslot')
        .select('timeslot_date, timeslot_start, timeslot_end, timeslot_rate, fk_court_id, Court(court_name)')
        .eq('fk_booking_id', booking_id)    
        
    // console.log(bookedTimeslot)

    if (selectTimeslotError || !bookedTimeslot) {
        console.log("Select BookedTimeslot failed at booking summary page")
        console.error(selectTimeslotError)
        redirect('/')
    }

    const { data: facilityData, error: selectFacilityError } = await supabase
        .from('Court')
        .select('SportsFacility(facility_name, facility_photo)')
        .eq('court_id', bookedTimeslot[0].fk_court_id)
        .single()

    if (selectFacilityError || !facilityData) {
        console.log("Select Court failed at booking summary page")
        console.error(selectFacilityError)
        redirect('/')
    }
    
    // console.log(facilityData)

    const { data: userData, error: selectUserError } = await supabase
        .from('Booking')
        .select('User(full_name, phone_num)')
        .eq('booking_id', booking_id)
        .single()
    
    if (selectUserError || !userData) {
        console.log("Select User failed at booking summary page")
        console.error(selectUserError)
        redirect('/')
    }

    const bookingSummaryData: BookingSummaryData[] = [];
    bookedTimeslot.map((timeslot: any) => {
        bookingSummaryData.push({
            timeslot_date: timeslot.timeslot_date,
            timeslot_start: timeslot.timeslot_start,
            timeslot_end: timeslot.timeslot_end,
            timeslot_rate: timeslot.timeslot_rate,
            court_name: timeslot.Court.court_name,
        })
    })


    return <BookingSuccess userData={userData.User} bookingData={bookingData} bookingSummaryData={bookingSummaryData} facilityData={facilityData.SportsFacility} />
}