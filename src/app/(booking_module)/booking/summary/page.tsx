'use server'

import { createClient } from '@/utils/supabase/server'
import BookingSummary from './client-side'
import { redirect } from 'next/navigation'

export type BookingSummaryData = {
    timeslot_date: string,
    timeslot_start: string,
    timeslot_end: string,
    timeslot_rate: number,
    court_name: string,
}

export async function MakePayment(booking_id:string, paymentMethod: string, paymentAmount: number) {
    let paymentSuccess = false;

    // TODO: Dummy payment gateway
    if (paymentMethod == "Online Banking") {
        paymentSuccess = true
    }
    else if (paymentMethod == "Credit Card") {
        paymentSuccess = true
    }
    else {
        return "Invalid payment method"
    }

    if (paymentSuccess) {
        const supabase = createClient()
        const { data: updateBooking, error: updateBookingError } = await supabase
            .from('Booking')
            .update({
                'transaction_amount': paymentAmount,
                'transaction_method': paymentMethod,
            })
            .eq('booking_id', booking_id)

        if (updateBookingError) {
            console.log("Update Booking failed")
            console.error(updateBookingError)
            return "Failed to update booking"
        }

        redirect('/booking/successful/?booking_id=' + booking_id)
    }
}

export default async function BookingSummaryPage({
    searchParams,
} : {
    searchParams? : {
        booking_id: string
    }
}) {
    const booking_id = searchParams?.booking_id
    if (!booking_id) {
        redirect('/')
    }

    const supabase = createClient()
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

    return <BookingSummary booking_id={booking_id} bookingSummaryData={bookingSummaryData} facilityData={facilityData.SportsFacility } />
}