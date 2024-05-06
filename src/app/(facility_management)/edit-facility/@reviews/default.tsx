'use server'
import FacilityReviews from "./client-side"

export default async function FacilityReviewsPage({
    searchParams,
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    const facility_id = searchParams?.facility_id || ''
    return (
        <FacilityReviews facility_id={facility_id}/>
    )
}