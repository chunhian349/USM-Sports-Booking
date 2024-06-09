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
    const booking_id = searchParams?.booking_id ?? ''
    if (booking_id == '') {
        redirect('/error/?error=Booking ID is missing')
    }

    const supabase = createClient()
    const { data: bookingData, error: selectBookingError } = await supabase
        .from('Booking')
        .select('booking_id, transaction_time, transaction_amount, transaction_method')
        .eq('booking_id', booking_id)
        .returns<{booking_id: string, transaction_time: string, transaction_amount: number, transaction_method: string}[]>()
        .single()

    if (selectBookingError || !bookingData) {
        const errorMessage = "Retrieve booking data failed (" + selectBookingError.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    // Incomplete booking
    if (!bookingData.transaction_time && !bookingData.transaction_amount && !bookingData.transaction_method) {
        redirect('/booking/summary/?booking_id=' + booking_id)
    }

    const { data: bookedTimeslot, error: selectTimeslotError } = await supabase
        .from('BookedTimeslot')
        .select('timeslot_date, timeslot_start, timeslot_end, timeslot_rate, fk_court_id, Court(court_name)')
        .eq('fk_booking_id', booking_id)    
        .returns<{
            timeslot_date: string;
            timeslot_start: string;
            timeslot_end: string;
            timeslot_rate: number;
            fk_court_id: string;
            Court: {
                court_name: string;
            };
        }[]>()

    if (selectTimeslotError || !bookedTimeslot) {
        const errorMessage = "Retrieve bookedTimeslot failed (" + selectTimeslotError.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    if (bookedTimeslot.length == 0) {
        redirect('/error/?error=The booking do not lock any timeslots')
    }

    const { data: facilityData, error: selectFacilityError } = await supabase
        .from('Court')
        .select('SportsFacility(facility_name, facility_photo)')
        .eq('court_id', bookedTimeslot[0].fk_court_id)
        .returns<{
            SportsFacility: {
                facility_name: string;
                facility_photo: string;
            }
        }[]>()
        .single()

    if (selectFacilityError || !facilityData) {
        const errorMessage = "Retrieve facility data failed (" + selectFacilityError.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    const { data: userData, error: selectUserError } = await supabase
        .from('Booking')
        .select('User(full_name, phone_num)')
        .eq('booking_id', booking_id)
        .returns<{User: {full_name: string, phone_num: string}}[]>()
        .single()
    
    if (selectUserError || !userData) {
        const errorMessage = "Retrieve user data failed (" + selectUserError.message + ")"
        redirect('/error/?error=' + errorMessage)
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