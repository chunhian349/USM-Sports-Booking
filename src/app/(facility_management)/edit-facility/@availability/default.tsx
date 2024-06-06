'use server'

import { redirect } from 'next/navigation'
import FacilityAvailability from './client-side'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const supabase = createClient()

export async function AddCourt(court_name: string, court_status: boolean, facility_id: string/*, formData: FormData*/): Promise<any> {
    // const unpackedData = {
    //     courtName: formData.get('courtname') as string,
    //     courtStatus: Boolean(formData.get('courtstatus')),
    // }

    const { error } = await supabase
        .from('Court')
        .insert({
            court_name: court_name,
            court_status: court_status,
            fk_facility_id: facility_id,
        })

    if (error) {
        console.error(error)
    }
    //revalidatePath('/edit-facility/?facility_id=' + facility_id)
    //redirect('/edit-facility/?facility_id=' + facility_id)
}

export async function DeleteCourt(/*facility_id: string, */court_id: string): Promise<any> {
    const { error } = await supabase
        .from('Court')
        .delete()
        .eq('court_id', court_id)

    if (error) {
        console.error(error)
    }
    //revalidatePath('/edit-facility/?facility_id=' + facility_id)
    //redirect('/edit-facility/?facility_id=' + facility_id)
}

export default async function FacilityAvailabilityPage({
    searchParams,
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    const facility_id = searchParams?.facility_id || ''

    // Data from Court table
    // let courtData = await supabase
    //     .from('Court')
    //     .select('*')
    //     .eq('fk_facility_id', paramObj.searchParams.facility_id)

    //console.log("Server courtData: " + JSON.stringify(courtData.data))

    // Data from TimeSlot table, for each court
    // let timeslotData : any = []
    // const courtDataLength = courtData.data?.length != undefined ? courtData.data?.length : 0
    // for (let index = 0; index < courtDataLength; index++) {
    //     let { data, error } = await supabase
    //         .from('BookedTimeslot')
    //         .select('*')
    //         .eq('fk_court_id', courtData.data?.[index].court_id)

    //     // Deep copy from data to timeslotData
    //     let tempData = JSON.parse(JSON.stringify(data))
    //     timeslotData.push(tempData)
    // }

    const { data: facilityData, error: selectFacilityError } = await supabase
        .from('SportsFacility')
        .select('facility_start_time, facility_end_time, timeslot_interval')
        .eq('facility_id', facility_id)
        .single()
    
    if (selectFacilityError || !facilityData) {
        console.log("FacilityAvailability select SportsFacility failed")
        console.error(selectFacilityError)
        redirect('/')
    }

    return (
        <FacilityAvailability 
            //courtData={courtData.data ? courtData.data : []} 
            //timeslotData={timeslotData}
            facility_id={facility_id}
            facilityData={facilityData}
        />
    )
}