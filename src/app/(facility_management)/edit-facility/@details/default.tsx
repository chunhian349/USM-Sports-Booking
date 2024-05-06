'use server'
import { createClient } from '@/utils/supabase/server'
import EditFacility from './client-side'
import { redirect } from 'next/navigation'

const supabase = createClient()

export async function UpdateFacilityImage(facility_id: string, user_id: string, formData: FormData): Promise<any> {
    //console.log("Facility ID: " + facility_id)
    //console.log("User ID: " + user_id)
    const unpackedData = {
        imageFile: formData.get('image') as File,
    }
    //console.log("Updated File Name: " + unpackedData.imageFile.name)
    
    // Insert into storage
    {
        const { error } = await supabase
        .storage
        .from('images')
        .upload('facility/' + user_id + "/" + unpackedData.imageFile.name, unpackedData.imageFile)
    }
    
    // Update image_url in SportsFacility
    {
        const image_url = (process.env.NEXT_PUBLIC_IMAGE_BUCKET_URL) + "facility/" + user_id + "/" + unpackedData.imageFile.name
        const { data, error } = await supabase
        .from('SportsFacility')
        .update({ 'image_url': image_url })
        .eq('facility_id', facility_id)
        .select() 
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

    // console.log("Facility Name: " + unpackedData.facilityName)
    // console.log("Location: " + unpackedData.location)
    // console.log("Sports Category: " + unpackedData.sportsCategory)
    // console.log("Phone Number: " + unpackedData.phoneNumber)
    
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
    .select() 

    //console.error(error)

    redirect('/edit-facility/?facility_id=' + facility_id)
}

export async function UpdateFacilityDesc(facility_id: string, formData: FormData): Promise<any> {

    const unpackedData = {
        description: formData.get('description') as string,
    }
    
    const { data, error } = await supabase
        .from('SportsFacility')
        .update({ facility_desc: unpackedData.description })
        .eq('facility_id', facility_id)
        .select() 

    console.error(error)

    redirect('/edit-facility/?facility_id=' + facility_id)
}

export default async function EditFacilityPage({
    searchParams,
} : {
    searchParams?: {
        facility_id: string
    }
}) {
    
    const { data : { user }} = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const facility_id = searchParams?.facility_id || ''
    //console.log("facility_id: " + facility_id)

    let { data: result, error } = await supabase
        .from('SportsFacility')
        .select('*')
        .eq('facility_id', facility_id)
        //.eq('fk_manager_id', user?.id)

    if (error) {
        console.error(error)
    }

    //console.log("User id from page: " + user.id)
    return <EditFacility facility={result?.at(0)} user_id={user.id}></EditFacility>
}