'use server'

import { createClient } from '@/utils/supabase/server'

export async function SubmitFacilityForm(formData: FormData) {
  const supabase = createClient()

  const { data : { user }} = await supabase.auth.getUser()
  if (!user) {
    return
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    imageFile: formData.get('image') as File,
    facilityName: formData.get('name') as string,
    location: formData.get('location') as string,
    phoneNumber: formData.get('phone') as string,
    sportsCategory: formData.get('sports') as string,
    operatingHours: formData.get('hours') as string,
    //bookingRate: formData.get('rate') as string,
    description: formData.get('description') as string,
    status: Boolean(formData.get('status')),
  }

    console.log("File Name: " + data.imageFile.name)
    // console.log("Facility Name: " + data.facilityName)
    // console.log("Location: " + data.location)
    // console.log("Phone Number: " + data.phoneNumber)
    // console.log("Sports Category: " + data.sportsCategory)
    // console.log("Operating Hours: " + data.operatingHours)
    // console.log("Booking Rate: " + data.bookingRate)
    // console.log("Description: " + data.description)
    // console.log("Status: " + data.status)
    {
        const { error } = await supabase
        .storage
        .from('images')
        .upload('facility/' + user.id + "/" + data.imageFile.name, data.imageFile)

        if (error) {
            console.error(error)
        }
    }

    // {    
    //     const { error } = await supabase
    //     .from('SportsFacility')
    //     .insert([
    //         { 
    //             facility_name: data.facilityName,
    //             facility_desc: data.description,
    //             facility_location: data.location,
    //             facility_status: data.status,
    //             phone_num: data.phoneNumber,
    //             sports_category: data.sportsCategory,
    //             operating_hours: JSON.stringify(data.operatingHours),
    //             fk_manager_id: user.id,
    //         }
    //     ])
    //     .select()

    //     if (error) {
    //         console.error(error)
    //     }
    // }
}