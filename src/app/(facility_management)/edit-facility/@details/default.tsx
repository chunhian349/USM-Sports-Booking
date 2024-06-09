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

export async function UpdateFacilityImage(facility_id: string, user_id: string, formData: FormData) {
    const imageFile = formData.get('image') as File ?? null;

    // form unable to get image, image input name attribute might not match
    if (!imageFile) {
        redirect('/error/?error=' + "Form unable to get image, image input name attribute might not match")
    }
    
    // Insert into storage
    const supabase = createClient()
    {
        const { error } = await supabase
        .storage
        .from('images')
        .upload('facility/' + user_id + "/" + imageFile.name, imageFile)
    
        if (error && error.message !== 'The resource already exists') {
            const errorMessage = "Update facility image storage failed (" + error.message + ")"
            redirect('/error/?error=' + errorMessage)
        }
    }
    
    // Update facility_photo in SportsFacility
    {
        const facility_photo = (process.env.NEXT_PUBLIC_IMAGE_BUCKET_URL) + "facility/" + user_id + "/" + imageFile.name
        const { error } = await supabase
        .from('SportsFacility')
        .update({ 'facility_photo': facility_photo })
        .eq('facility_id', facility_id)

        if (error) {
            const errorMessage = "Update facility table failed (" + error.message + ")"
            redirect('/error/?error=' + errorMessage)
        }
    }

    redirect('/edit-facility/?facility_id=' + facility_id)
}

export async function UpdateFacilityDetails(facility_id: string, formData: FormData) {
    //console.log("Facility ID: " + facility_id)
    const facilityName = formData.get('name') as string ?? '';
    const location = formData.get('location') as string ?? '';
    const sportsCategory = formData.get('sports') as string ?? '';
    const phoneNumber = formData.get('phone') as string ?? '';
    const status = Boolean(formData.get('status'));
    
    const supabase = createClient()
    const { error } = await supabase
    .from('SportsFacility')
    .update({
        facility_name: facilityName,
        facility_location: location,
        sports_category: sportsCategory,
        phone_num: phoneNumber,
        facility_status: status,
    })
    .eq('facility_id', facility_id)

    if (error) {
        const errorMessage = "Update facility details failed (" + error.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    redirect('/edit-facility/?facility_id=' + facility_id)
}

export async function UpdateFacilityDesc(facility_id: string, formData: FormData) {
    const description = formData.get('description') as string ?? '';

    const supabase = createClient()
    const { error } = await supabase
        .from('SportsFacility')
        .update({ facility_desc: description })
        .eq('facility_id', facility_id)

    if (error) {
        const errorMessage = "Update facility description failed (" + error.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    redirect('/edit-facility/?facility_id=' + facility_id)
}

export async function UpdateFacilityRates(facility_id: string, formData: FormData) {
    const supabase = createClient()

    const bookingRatesObj = { 
        normal: {
          student: Number(formData.get('normStudentRate')) ?? 0,
          staff: Number(formData.get('normStaffRate')) ?? 0,
          private: Number(formData.get('normPrivateRate')) ?? 0,
        }, 
        rush: {
          student: Number(formData.get('rushStudentRate')) ?? 0,
          staff: Number(formData.get('rushStaffRate')) ?? 0,
          private: Number(formData.get('rushPrivateRate')) ?? 0,
        }
      }

    const { error } = await supabase
        .from('SportsFacility')
        .update({ 'booking_rates': bookingRatesObj })
        .eq('facility_id', facility_id)

    if (error) {
        const errorMessage = "Update facility rates failed (" + error.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    redirect('/edit-facility/?facility_id=' + facility_id)
}

export async function DeleteSportsFacility(facility_id: string): Promise<any> {
    
    const supabase = createClient()
    const { error } = await supabase
        .from('SportsFacility')
        .delete()
        .eq('facility_id', facility_id)

    if (error) {
        const errorMessage = "Delete sports facility failed (" + error.message + ")"
        redirect('/error/?error=' + errorMessage)
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

    const { data: facilityData, error: selectFacilityError } = await supabase
        .from('SportsFacility')
        .select('facility_id, facility_photo, facility_name, facility_location, sports_category, phone_num, facility_status, facility_desc, booking_rates')
        .eq('facility_id', facility_id)
        .single()

    if (selectFacilityError || !facilityData) {
        const errorMessage = "Retrieve sports facility data failed (" + selectFacilityError.message + ")"
        redirect('/error/?error=' + errorMessage)
    }

    return <EditFacility facilityData={facilityData as FacilityData} user_id={user.id}></EditFacility>
}