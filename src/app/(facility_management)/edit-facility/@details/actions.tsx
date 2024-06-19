'use server'
import { createClient } from '@/utils/supabase/server'
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

export async function UpdateFacilityImage(prevState: any, formData: FormData) {
    const facility_id = formData.get('facilityid') as string ?? '';
    const user_id = formData.get('userid') as string ?? '';
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
            return { isActionSuccess: true, message: error.message}
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
            return { isActionSuccess: true, message: error.message}
        }
    }

    return { isActionSuccess: true, message: "Facility image has been updated successfully."}
}

export async function UpdateFacilityDetails(prevState: any, formData: FormData) {
    const facility_id = formData.get('facilityid') as string ?? '';
    const facilityName = formData.get('name') as string ?? '';
    const location = formData.get('location') as string ?? '';
    const sportsCategory = formData.get('sports') as string ?? '';
    const phoneNumber = formData.get('phone') as string ?? '';
    const status = Boolean(formData.get('status'));
    console.log(facility_id)

    // Validation for phone number
    const phoneNumRegex = /^[0-9+]*$/;
    if (!phoneNumRegex.test(phoneNumber)) {
        return { isActionSuccess: false, message: "Invalid phone number format." }
    }
    
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
        return { isActionSuccess: false, message: error.message }
    }

    return { isActionSuccess: true, message: "Facility details have been updated successfully."}
}

export async function UpdateFacilityDesc(prevState: any, formData: FormData) {
    const facility_id = formData.get('facilityid') as string ?? '';
    const description = formData.get('description') as string ?? '';

    const supabase = createClient()
    const { error } = await supabase
        .from('SportsFacility')
        .update({ facility_desc: description })
        .eq('facility_id', facility_id)

    if (error) {
        return { isActionSuccess: false, message: error.message }
    }

    return { isActionSuccess: true, message: "Facility description has been updated successfully."}
}

export async function UpdateFacilityRates(prevState: any, formData: FormData) {
    const supabase = createClient()

    const facility_id = formData.get('facilityid') as string ?? '';

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
        return { isActionSuccess: false, message: error.message }
    }

    return { isActionSuccess: true, message: "Facility rates have been updated successfully."}
}

export async function DeleteSportsFacility(prevState: any, formData: FormData): Promise<any> {
    const facility_id = formData.get('facilityid') as string ?? '';

    const supabase = createClient()
    const { error } = await supabase
        .from('SportsFacility')
        .delete()
        .eq('facility_id', facility_id)

    if (error) {
        return { isActionSuccess: false, message: error.message }
    }

    return { isActionSuccess: true, message: "Facility has been deleted, redirecting to homepage..."}
}