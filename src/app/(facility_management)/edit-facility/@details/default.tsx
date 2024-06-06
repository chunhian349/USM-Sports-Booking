'use server'
import { createClient } from '@/utils/supabase/server'
import EditFacility from './client-side'
import { redirect } from 'next/navigation'

export type FacilityData = {
    facility_id: string;
    facility_photo: string;
    facility_name: string;
    facility_location: string;
    sports_category: string;
    phone_num: string;
    facility_status: boolean;
    facility_desc: string;
    booking_rates: {
        normal : {
            student: number,
            staff: number,
            private: number
        },
        rush : {
            student: number,
            staff: number,
            private: number
        }
    }
}

export async function UpdateFacilityImage(facility_id: string, user_id: string, formData: FormData): Promise<any> {
    //console.log("Facility ID: " + facility_id)
    //console.log("User ID: " + user_id)
    const unpackedData = {
        imageFile: formData.get('image') as File,
    }
    //console.log("Updated File Name: " + unpackedData.imageFile.name)
    
    // Insert into storage
    const supabase = createClient()
    {
        const { error } = await supabase
        .storage
        .from('images')
        .upload('facility/' + user_id + "/" + unpackedData.imageFile.name, unpackedData.imageFile)
    
        if (error) {
            console.error(error)
        }
    }
    
    // Update facility_photo in SportsFacility
    {
        const facility_photo = (process.env.NEXT_PUBLIC_IMAGE_BUCKET_URL) + "facility/" + user_id + "/" + unpackedData.imageFile.name
        const { data, error } = await supabase
        .from('SportsFacility')
        .update({ 'facility_photo': facility_photo })
        .eq('facility_id', facility_id)

        if (error) {
            console.error(error)
        }
    }

    redirect('/edit-facility/?facility_id=' + facility_id)
}

export async function UpdateFacilityDetails(facility_id: string, formData: FormData): Promise<any> {
    //console.log("Facility ID: " + facility_id)
    const unpackedData = {
        facilityName: formData.get('name') as string,
        location: formData.get('location') as string,
        sportsCategory: formData.get('sports') as string,
        phoneNumber: formData.get('phone') as string,
        status: Boolean(formData.get('status')),
    }

    //console.log(unpackedData)
    
    {
        const supabase = createClient()
        const { data, error } = await supabase
        .from('SportsFacility')
        .update({
            facility_name: unpackedData.facilityName,
            facility_location: unpackedData.location,
            sports_category: unpackedData.sportsCategory,
            phone_num: unpackedData.phoneNumber,
            facility_status: unpackedData.status,
        })
        .eq('facility_id', facility_id)

        if (error) {
            console.error(error)
        }
    }

    redirect('/edit-facility/?facility_id=' + facility_id)
}

export async function UpdateFacilityDesc(facility_id: string, formData: FormData): Promise<any> {
    const unpackedData = {
        description: formData.get('description') as string,
    }
    
    {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('SportsFacility')
            .update({ facility_desc: unpackedData.description })
            .eq('facility_id', facility_id)
    
        if (error) {
            console.error(error)
        }
    }

    redirect('/edit-facility/?facility_id=' + facility_id)
}

export async function UpdateFacilityRates(facility_id: string, booking_rates: FacilityData['booking_rates']): Promise<any> {
    // console.log(booking_rates)
    
    {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('SportsFacility')
            .update({ 'booking_rates': booking_rates })
            .eq('facility_id', facility_id)

        if (error) {
            console.error(error)
        }
    }

    redirect('/edit-facility/?facility_id=' + facility_id)
}

export async function DeleteSportsFacility(facility_id: string): Promise<any> {
    // console.log("Deleting the facility: " + facility_id)
    const supabase = createClient()
    const { data, error } = await supabase
        .from('SportsFacility')
        .delete()
        .eq('facility_id', facility_id)

    if (error) {
        console.error(error)
    }

    redirect('/')
}

export default async function EditFacilityPage({
    searchParams,
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    const supabase = createClient()
    const { data : { user }} = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const facility_id = searchParams?.facility_id || ''
    //console.log("facility_id: " + facility_id)

    let { data: facilityData, error: selectFacilityError } = await supabase
        .from('SportsFacility')
        .select('facility_id, facility_photo, facility_name, facility_location, sports_category, phone_num, facility_status, facility_desc, booking_rates')
        .eq('facility_id', facility_id)
        .single()

    if (selectFacilityError || !facilityData) {
        console.log("Facility not found at facility management page")
        console.error(selectFacilityError)
        redirect('/')
    }

    // console.log(facilityData)
    return <EditFacility facilityData={facilityData as FacilityData} user_id={user.id}></EditFacility>
}