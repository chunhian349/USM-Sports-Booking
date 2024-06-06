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

export async function SubmitFacilityForm(formData: FormData) : Promise<any> {
  const { data : { user }} = await supabase.auth.getUser()
  if (!user) {
    return { message: "User not found" }
  }

  // Convert booking rates into obj
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
  // console.log(bookingRatesObj)

  // Convert intervals into minutes
  const timeslotInterval = (Number(formData.get('intervalHour')) ?? 0) * 60 + (Number(formData.get('intervalMin')) ?? 0)
  // console.log(timeslotInterval)

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    imageFile: formData.get('image') as File,
    facilityName: formData.get('name') as string,
    location: formData.get('location') as string,
    phoneNumber: formData.get('phone') as string,
    sportsCategory: formData.get('sports') as string,
    startTime: formData.get('startTime') as string,
    endTime: formData.get('endTime') as string,
    description: formData.get('description') as string,
    status: Boolean(formData.get('status')),
  }

  // console.log("File Name: " + data.imageFile.name)
  // console.log("Facility Name: " + data.facilityName)
  // console.log("Location: " + data.location)
  // console.log("Phone Number: " + data.phoneNumber)
  // console.log("Sports Category: " + data.sportsCategory)
  // console.log("Start Time: " + data.startTime)
  // console.log("End Time: " + data.endTime)
  // console.log("Booking Rate: " + data.bookingRate)
  // console.log("Description: " + data.description)
  // console.log("Status: " + data.status)
  // console.log(data)

  InsertImage(data.imageFile, user.id)

  const facility_photo = (process.env.NEXT_PUBLIC_IMAGE_BUCKET_URL) + "facility/" + user.id + "/" + data.imageFile.name
  const { data: insertData, error } = await supabase
  .from('SportsFacility')
  .insert([
    { 
      facility_photo: facility_photo,
      facility_name: data.facilityName,
      facility_location: data.location,
      phone_num: data.phoneNumber,
      sports_category: data.sportsCategory,
      facility_start_time: data.startTime,
      facility_end_time: data.endTime,
      timeslot_interval: timeslotInterval,
      booking_rates: bookingRatesObj,
      facility_desc: data.description,
      facility_status: data.status,
      fk_manager_id: user.id,
    }
  ])
  .select('facility_id')
  .single()

  if (error || !insertData) {
    return error
  }

  redirect('/edit-facility/?facility_id=' + insertData.facility_id)
}