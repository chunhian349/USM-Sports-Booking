'use server'

import BookingHistory from './client-site'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { type BookingDetails } from './actions'

export default async function BookingHistoryPage() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    
    if (!user) {
        redirect('/')
    }

    // Fetch booking data from database
    const { data: bookingData, error: selectBookingError } = await supabase
        .from('Booking')
        .select('booking_id, transaction_time, transaction_method, transaction_amount, booking_created_at')
        .eq('fk_user_id', user.id)
        .order('transaction_time', { ascending: false })
        .returns<{
            booking_id: string;
            transaction_time: string;
            transaction_method: string;
            transaction_amount: number;
            booking_created_at: string;
        }[]>()
    
    if (selectBookingError || !bookingData) {
        console.log("Select Booking failed at booking history page")
        console.error(selectBookingError)
        return <BookingHistory completedBooking={[]} incompleteBooking={[]} bookingDetails={new Map()} />
    } 
    // console.log(bookingData)
    const arr_booking_id: string[] = bookingData.map((booking) => booking.booking_id)

    // Fetch booked timeslot data from database
    // if arr_booking_id is null, then bookedTimeslot will be null
    const { data: bookedTimeslotData, error: selectTimeslotError } = await supabase
        .from('BookedTimeslot')
        .select('fk_booking_id, timeslot_date, timeslot_start, timeslot_end, timeslot_rate, fk_court_id, Court(court_name, SportsFacility(facility_name, facility_photo))')
        .in('fk_booking_id', arr_booking_id)
        .returns<{
            fk_booking_id: string;
            timeslot_date: string;
            timeslot_start: string;
            timeslot_end: string;
            timeslot_rate: number;
            fk_court_id: string;
            Court: {
                court_name: string;
                SportsFacility: {
                    facility_name: string;
                    facility_photo: string;
                };
            };
        }[]>()

    if (selectTimeslotError || !bookedTimeslotData) {
        console.log("Select BookedTimeslot failed at booking history page")
        console.error(selectTimeslotError)
        return <BookingHistory completedBooking={[]} incompleteBooking={[]} bookingDetails={new Map()} />
    }

    // User with no booking data can pass above error checks, pass zero length array props

    // Split booking data into completed and incomplete booking
    const completedBooking : { booking_id: string, transaction_time: string, transaction_method: string, transaction_amount: number}[] = [];
    const incompleteBooking : { booking_id: string, booking_created_at: string }[] = [];
    bookingData.forEach((booking) => {
        // Transaction time is set only when booking is completed, else booking is incomplete
        if (booking.transaction_time /*&& booking.transaction_method && booking.transaction_amount*/) {
            completedBooking.push({
                booking_id: booking.booking_id,
                transaction_time: booking.transaction_time,
                transaction_method: booking.transaction_method,
                transaction_amount: booking.transaction_amount
            })
        } else {
            incompleteBooking.push({
                booking_id: booking.booking_id,
                booking_created_at: booking.booking_created_at
            })
        }
    })

    // console.log(completedBooking)
    // console.log(incompleteBooking)

    // row is booking, column is bookedTimeslots of the booking
    // false alarms on type error, Court and SportsFacility are not arrays
    const bookingDetails = new Map<string, BookingDetails[]>()
    bookingData.forEach(booking => {
        const bookingDetailsByBookingId: BookingDetails[] = bookedTimeslotData.filter((bookedTimeslot) => {
            return bookedTimeslot.fk_booking_id === booking.booking_id
        }).map((bookedTimeslot) => {
            return {
                timeslot_date: bookedTimeslot.timeslot_date as string,
                timeslot_start: bookedTimeslot.timeslot_start as string,
                timeslot_end: bookedTimeslot.timeslot_end as string,
                timeslot_rate: bookedTimeslot.timeslot_rate as number,
                court_name: bookedTimeslot.Court.court_name as string,
                facility_name: bookedTimeslot.Court.SportsFacility.facility_name as string,
                facility_photo: bookedTimeslot.Court.SportsFacility.facility_photo as string
            }
        })
        bookingDetails.set(booking.booking_id as string, bookingDetailsByBookingId)
    })

    //console.log(bookingDetails)

    return <BookingHistory completedBooking={completedBooking} incompleteBooking={incompleteBooking} bookingDetails={bookingDetails} />
}