'use server'

import { createClient } from '@/utils/supabase/server'
import BookingSummary from './client-side'
import { redirect } from 'next/navigation'
import { type BookingSummaryData } from './actions'

export default async function BookingSummaryPage({
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
        .select('booking_created_at, transaction_time, transaction_amount, transaction_method')
        .eq('booking_id', booking_id)
        .returns<{booking_created_at: string, transaction_time: string, transaction_amount: number, transaction_method: string}[]>()
        .single()

    if (selectBookingError || !bookingData) {
        const errorMessage = "Retrieve booking data failed (" + selectBookingError.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    // Completed booking cannot access this page
    if (bookingData.transaction_time && bookingData.transaction_amount && bookingData.transaction_method) {
        redirect('/error/?error=Booking has been completed')
    }

    if (bookingData.booking_created_at.length == 0) {
        redirect('/error/?error=booking_created_at is empty')
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
        .returns<{SportsFacility: {facility_name: string, facility_photo: string}}[]>()
        .single()

    if (selectFacilityError || !facilityData) {
        const errorMessage = "Retrieve facility data failed (" + selectFacilityError.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    // Calculate booking expiry time (30 minutes)
    const booking_expiry_time = new Date(bookingData.booking_created_at)
    const BOOKING_TIME_LIMIT = 30 * 60 * 1000 // 30 minutes
    booking_expiry_time.setTime(booking_expiry_time.getTime() + BOOKING_TIME_LIMIT)

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

    return (
        <BookingSummary 
            bookingData={{booking_id: booking_id, booking_expiry_time: booking_expiry_time}} 
            bookingSummaryData={bookingSummaryData} 
            facilityData={facilityData.SportsFacility } />
    )
}