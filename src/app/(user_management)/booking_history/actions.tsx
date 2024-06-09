'use server'

import { createClient } from '@/utils/supabase/server'

export type BookingDetails = {
    timeslot_date: string;
    timeslot_start: string;
    timeslot_end: string;
    timeslot_rate: number;
    court_name: string;
    facility_name: string;
    facility_photo: string;
}

export async function SubmitReview(booking_id: string, review_rating: number, review_comment: string) : Promise<boolean> {
    const supabase = createClient()

    const { error } = await supabase
        .from('Review')
        .insert([{ 
            'fk_booking_id': booking_id, 
            'review_rating': review_rating, 
            'review_comment': review_comment 
        }])

    if (error) {
        console.error(error)
        return false;
    }

    return true;
}

export async function SelectReview(booking_id: string[]) : Promise<{fk_booking_id: string, review_rating: number, review_comment: string}[]>{
    const supabase = createClient()

    const { data: reviewData, error: selectReviewError } = await supabase
        .from('Review')
        .select('fk_booking_id, review_rating, review_comment')
        .in('fk_booking_id', booking_id)

    if (selectReviewError) {
        console.log("Select Review failed")
        console.error(selectReviewError)
        return [];
    }

    return reviewData;
}