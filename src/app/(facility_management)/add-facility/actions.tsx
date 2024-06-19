'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function SubmitFacilityForm(prevState: any, formData: FormData) {
  const supabase = createClient()

  const { data : { user }} = await supabase.auth.getUser()
  if (!user) {
    revalidatePath('/', 'layout')
    redirect('/')
  }

  // Convert booking rates into obj (frontend control values > 0)
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
  // console.log(timeslotInterval / 60)

  // type-casting here for convenience
  // if the input name attribute is not found, the value will be null, so we need to type-cast it to prevent errors
  const imageFile = formData.get('image') as File ?? null;
  const facilityName = formData.get('name') as string  ?? '';
  const location = formData.get('location') as string ?? '';
  const phoneNumber = formData.get('phone') as string ?? '';
  const sportsCategory = formData.get('sports') as string ?? '';
  const startTime = formData.get('startTime') as string ?? '';
  const endTime = formData.get('endTime') as string ?? '';
  const description = formData.get('description') as string ?? '';
  const status = Boolean(formData.get('status')) ?? false;

  // Validate inputs
  // if no file is uploaded, supabase will not throw an error, file name will become 'undefined'
  if (!imageFile) {
    return { isActionSuccess: false, message: "Form unable to get image, image input name attribute might not match" }
  }

  const phoneNumRegex = /^[0-9+]*$/;
  if (!phoneNumRegex.test(phoneNumber)) {
    return { isActionSuccess: false, message: "Invalid phone number format." }
  }

  if (startTime >= endTime) {
    return { isActionSuccess: false, message: "Invalid operating hours, start time must be earlier than end time" }
  }

  // Upload image to storage
  {
    const { error } = await supabase
      .storage
      .from('images')
      .upload('facility/' + user.id + "/" + imageFile.name, imageFile)
    
    // if the image already exists, ignore the error
    if (error && error.message !== 'The resource already exists') {
      return { isActionSuccess: false, message: error.message }
    }
  }

  const facility_photo = (process.env.NEXT_PUBLIC_IMAGE_BUCKET_URL) + "facility/" + user.id + "/" + imageFile.name
  const { data: insertData, error } = await supabase
  .from('SportsFacility')
  .insert([
    { 
      facility_photo: facility_photo,
      facility_name: facilityName,
      facility_location: location,
      phone_num: phoneNumber,
      sports_category: sportsCategory,
      facility_start_time: startTime,
      facility_end_time: endTime,
      timeslot_interval: timeslotInterval,
      booking_rates: bookingRatesObj,
      facility_desc: description,
      facility_status: status,
      fk_manager_id: user.id,
    }
  ])
  .select('facility_id')
  .returns<{ facility_id: string }[]>()
  .single()

  if (error) {
    return { isActionSuccess: false, message: error.message }
  }

  if (!insertData || insertData.facility_id.length === 0) {
    redirect('/error/?error=' + "Unable to get new facility id, please try to access the new facility from homepage.")
  }

  // return facility id for redirect
  return { isActionSuccess: true, message: insertData.facility_id}
}