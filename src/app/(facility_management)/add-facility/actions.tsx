'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

export async function InsertImage(imageFile: File, user_id: string){
  const { error } = await supabase
  .storage
  .from('images')
  .upload('facility/' + user_id + "/" + imageFile.name, imageFile)
  
  // if the image already exists, ignore the error
  if (error?.message !== 'The resource already exists') {
    return error
  }
}

export async function SubmitFacilityForm(formData: FormData): Promise<any> {
  const { data : { user }} = await supabase.auth.getUser()
  if (!user) {
    return { message: "User not found" }
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

  InsertImage(data.imageFile, user.id)

  {
    const image_url = (process.env.NEXT_PUBLIC_IMAGE_BUCKET_URL) + "facility/" + user.id + "/" + data.imageFile.name
    const { error } = await supabase
    .from('SportsFacility')
    .insert([
      { 
        facility_name: data.facilityName,
        facility_desc: data.description,
        facility_location: data.location,
        facility_status: data.status,
        phone_num: data.phoneNumber,
        sports_category: data.sportsCategory,
        operating_hours: JSON.stringify(data.operatingHours),
        image_url: image_url,
        fk_manager_id: user.id,
      }
    ])
    .select()

    if (error) {
      return error
    }
  }

  let { data: result , error } = await supabase
    .from('SportsFacility')
    .select('facility_id')
    .eq('facility_name', data.facilityName)
    .eq('fk_manager_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
  }

  redirect('/edit-facility/?facility_id=' + result?.at(0)?.facility_id)
}