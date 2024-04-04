'use server'
import FacilityReviews from "./client-side"

export default async function FacilityReviewsPage(facility_id: JSON | null) {
    const paramObj = JSON.parse(JSON.stringify(facility_id))
    return (
        <FacilityReviews facility_id={paramObj.searchParams.facility_id}/>
    )
}