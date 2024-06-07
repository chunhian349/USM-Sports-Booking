'use server'
import FacilityReviews from "./client-side"
import { createClient } from "@/utils/supabase/server"

export default async function FacilityReviewsPage({
    searchParams,
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    const facility_id = searchParams?.facility_id || ''
    const supabase = createClient()

    const { data: reviewData, error: selectReviewError } = await supabase
        .rpc('selectreviewbyfacilityid', { facility_id: facility_id })
        .returns<{ review_id: string, review_rating: number, review_comment: string, review_created_at: string }[]>()

    if (selectReviewError || !reviewData) {
        console.error(selectReviewError)
        return <FacilityReviews reviewData={[]} overall_rating={0}></FacilityReviews>
    }

    const { data: facilityData, error: selectFacilityError } = await supabase
        .from('SportsFacility')
        .select('overall_rating')
        .eq('facility_id', facility_id)
        .returns<{ overall_rating: number }[]>()
        .single()

    if (selectFacilityError) {
        console.error(selectFacilityError)
    }

    return (
        <FacilityReviews reviewData={reviewData} overall_rating={Number(facilityData?.overall_rating) ?? 0}/>
    )
}