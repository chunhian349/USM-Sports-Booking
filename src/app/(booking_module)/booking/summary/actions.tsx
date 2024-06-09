'use server'
import { createClient } from '@/utils/supabase/server'
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
        const { error: updateBookingError } = await supabase
            .from('Booking')
            .update({
                'transaction_amount': paymentAmount,
                'transaction_method': paymentMethod,
            })
            .eq('booking_id', booking_id)

        if (updateBookingError) {
            // console.log("Update Booking failed")
            // console.error(updateBookingError)
            return "Failed to update booking"
        }

        redirect('/booking/successful/?booking_id=' + booking_id)
    }
}

export async function isBookingExpired(booking_id: string) {
    const supabase = createClient()

    const { data: bookingData, error: selectBookingError } = await supabase
        .from('Booking')
        .select('booking_created_at')
        .eq('booking_id', booking_id)
        .returns<{booking_created_at: string}[]>()
        .single()

    if (selectBookingError || !bookingData || bookingData.booking_created_at.length == 0) {
        // console.log("Select Booking failed at booking summary page")
        // console.error(selectBookingError)
        return true
    }

    const lockTime = new Date(bookingData.booking_created_at)
    const currentTime = new Date()
    const timeDiff = currentTime.getTime() - lockTime.getTime()
    const MAX_DIFF = 30 * 60 * 1000 // 30 minutes  
    return timeDiff > MAX_DIFF
}